<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Models\Cart;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function viewItemDetails($product_id)
    {
        $product = Product::with('images')->find($product_id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Ensure that the image paths are full URLs
        $product->images->transform(function ($img) {
            $img->url = asset('storage/'.$img->path); // Ensuring it's a full URL
            return $img;
        });

        return response()->json($product);
    }

      public function searchItem(Request $request)
    {
        $term = $request->query('q');

        $q = Product::with('images');

        if ($term) {
            $q->where(function($x) use ($term) {
                $x->where('name', 'like', "%{$term}%")
                ->orWhere('weaving_type', 'like', "%{$term}%")
                ->orWhere('barcode_value', 'like', "%{$term}%");
            });
        }

        $products = $q->limit(20)->get();

        // transform image URLs
        $products->transform(function ($p) {
            $p->images->transform(function ($img) {
                $img->url = asset('storage/'.$img->path);
                return $img;
            });
            return $p;
        });

        return response()->json([
            'products' => $products,
            'suggestions' => $products->pluck('name')->take(5),
        ]);
    }

    public function addToCart(Request $request)
    {
        $user = $request->user(); // 👈 resolved from Bearer token in middleware
        Log::info('Incoming Request User:', $user->toArray());
        $data = $request->validate([
            'product_id' => 'required|integer|exists:products,product_id',
            'quantity'   => 'nullable|integer|min:1',
        ]);

        $productId = (int) $data['product_id'];
        $quantity  = (int) ($data['quantity'] ?? 1);

        // Find the user's latest cart OR create one
        $cart = $user->carts()->latest()->first()
            ?? $user->carts()->create(['total_price' => 0]);

        DB::transaction(function () use ($cart, $productId, $quantity) {
            $existing = $cart->items()->whereKey($productId)->first();
            $newQty   = ($existing ? (int)$existing->pivot->quantity : 0) + $quantity;

            $cart->items()->syncWithoutDetaching([$productId => ['quantity' => $newQty]]);

            $cart->load('items');
            $cart->total_price = $cart->items->sum(fn($p) => $p->price * $p->pivot->quantity);
            $cart->save();
        });

        $cart->load('items');

        return response()->json([
            'message' => 'Item added to cart!',
            'cart' => [
                'cart_id'     => $cart->getKey(),
                'total_price' => $cart->total_price,
                'items'       => $cart->items->map(fn($p) => [
                    'product_id' => $p->getKey(),
                    'name'       => $p->name,
                    'price'      => $p->price,
                    'quantity'   => (int)$p->pivot->quantity,
                    'subtotal'   => $p->price * $p->pivot->quantity,
                ])->values(),
            ],
        ]);
    }
}
