<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
   public function getDetails(Request $request)
    {
        $q = Product::with('images')
            ->withSum(['orderItems as sales_quantity' => function($query) {
                $query->whereHas('order', function($q) {
                    $q->where('status', '!=', 'pending');
                });
            }], 'quantity');

        // Search filter
        if ($s = $request->query('search')) {
            $q->where(function($x) use ($s) {
                $x->where('name','like',"%{$s}%")
                ->orWhere('weaving_type','like',"%{$s}%")
                ->orWhere('barcode_value','like',"%{$s}%");
            });
        }

        if ($c = $request->query('weavingType')) {
            $q->where('weaving_type', $c);
        }

        // Sorting
        if ($sort = $request->query('sort')) {
            [$field, $direction] = explode('_', $sort);
            $q->orderBy($field, $direction);
        } else {
            $q->latest('product_id');
        }

        // Pagination
        $products = $q->paginate((int) $request->query('per_page', 10));

        // Transform images URLs
        $products->getCollection()->transform(function ($p) {
            $p->images->transform(function ($img) {
                $img->url = asset('storage/'.$img->path);
                return $img;
            });
            return $p;
        });

        return response()->json($products);
    }

    public function related($product_id, Request $request)
    {
        $limit = max(1, min(20, (int) $request->query('limit', 8)));

        $product = Product::where('product_id', $product_id)->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        // Base query with images + sales sum (ignoring pending orders)
        $base = Product::with('images')
            ->withSum(['orderItems as sales_quantity' => function ($q) {
                $q->whereHas('order', function ($qq) {
                    $qq->where('status', '!=', 'pending');
                });
            }], 'quantity')
            ->where('product_id', '!=', $product->product_id)
            ->where('stock', '>', 0);

        $bag = collect();

        // 1) Same weaving_type
        if (!empty($product->weaving_type)) {
            $sameType = (clone $base)
                ->where('weaving_type', $product->weaving_type)
                ->orderByDesc('sales_quantity')
                ->latest('product_id')
                ->take($limit)
                ->get();
            $bag = $bag->merge($sameType);
        }

        // 2) Similar name tokens (skip tiny/common words)
        if ($bag->count() < $limit && !empty($product->name)) {
            $tokens = collect(preg_split('/\s+/', $product->name))
                ->filter(fn ($w) => mb_strlen($w) >= 3)
                ->take(4)
                ->values();

            if ($tokens->isNotEmpty()) {
                $byName = (clone $base)
                    ->where(function ($q) use ($tokens) {
                        foreach ($tokens as $t) {
                            $q->orWhere('name', 'like', "%{$t}%");
                        }
                    })
                    ->orderByDesc('sales_quantity')
                    ->latest('product_id')
                    ->take($limit * 2) // get extra, we’ll unique below
                    ->get();

                $bag = $bag->merge($byName);
            }
        }

        // 3) Price window (+/- 20%)
        if ($bag->count() < $limit && !is_null($product->price)) {
            $low  = max(0, $product->price * 0.8);
            $high = $product->price * 1.2;

            $byPrice = (clone $base)
                ->whereBetween('price', [$low, $high])
                ->orderByDesc('sales_quantity')
                ->latest('product_id')
                ->take($limit * 2)
                ->get();

            $bag = $bag->merge($byPrice);
        }

        // Unique by product_id and trim to limit
        $related = $bag->unique('product_id')->take($limit)->values();

        // Transform image URLs like your other endpoints
        $related->transform(function ($p) {
            $p->images->transform(function ($img) {
                $img->url = asset('storage/' . $img->path);
                return $img;
            });
            return $p;
        });

        return response()->json([
            'products'  => $related,
            'based_on'  => [
                'weaving_type' => (bool) $product->weaving_type,
                'name_tokens'  => !empty($product->name),
                'price_window' => !is_null($product->price),
            ],
        ]);
    }

}
