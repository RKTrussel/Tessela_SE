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
        $q = Product::with('images');

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
            // Expected format: price_asc, price_desc, name_asc, name_desc
            [$field, $direction] = explode('_', $sort);
            $q->orderBy($field, $direction);
        } else {
            $q->latest('product_id'); // Default fallback
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
}
