<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;
use App\Models\Item;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CartController extends Controller
{
    public function show()
    {
        $cart = \App\Models\Cart::latest()
            ->with(['products.images' => fn($q) => $q->orderBy('order')])
            ->first();

        if (!$cart) {
            return response()->json([
                'cart_id'     => null,
                'total_price' => 0,
                'items'       => [],
            ]);
        }

        $items = $cart->products->map(function ($p) {
            $first = $p->images->first();
            $imgUrl = $first?->url ?? ($first?->path ? asset('storage/'.$first->path) : null);

            return [
                'product_id' => $p->id,
                'name'       => $p->name,
                'price'      => (float) $p->price,
                'quantity'   => (int) $p->pivot->quantity,
                'subtotal'   => (float) ($p->price * $p->pivot->quantity),
                'image_url'  => $imgUrl,
            ];
        })->values();

        return response()->json([
            'cart_id'     => $cart->getKey(),
            'total_price' => (float) $cart->total_price,
            'items'       => $items,
        ]);
    }
    
    public function addItem(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'nullable|integer|min:1',
        ]);

        $productId = (int) $data['product_id'];
        $quantity  = (int) ($data['quantity'] ?? 1);

        // One global cart
        $cart = \App\Models\Cart::latest()->first()
            ?? \App\Models\Cart::create(['total_price' => 0]);

        DB::transaction(function () use ($cart, $productId, $quantity) {
            $existing = $cart->products()->whereKey($productId)->first();
            $newQty   = ($existing ? (int)$existing->pivot->quantity : 0) + $quantity;

            $cart->products()->syncWithoutDetaching([$productId => ['quantity' => $newQty]]);

            $cart->load('products');
            $cart->total_price = $cart->products->sum(fn($p) => $p->price * $p->pivot->quantity);
            $cart->save();
        });

        $cart->load('products');

        return response()->json([
            'message' => 'Item added to cart!',
            'cart' => [
                'cart_id'     => $cart->getKey(),
                'total_price' => $cart->total_price,
                'items'       => $cart->products->map(fn($p) => [
                    'product_id' => $p->getKey(),
                    'name'       => $p->name,
                    'price'      => $p->price,
                    'quantity'   => (int)$p->pivot->quantity,
                    'subtotal'   => $p->price * $p->pivot->quantity,
                ])->values(),
            ],
        ]);
    }

    // Remove an item from cart
    public function removeItem($itemId)
    {
        $user = Auth::user();
        $cart = $user->carts()->latest()->first();

        if ($cart) {
            $cart->items()->detach($itemId);
        }

        return redirect()->back()->with('success', 'Item removed from cart!');
    }

    // Clear entire cart
    public function clear()
    {
        $user = Auth::user();
        $cart = $user->carts()->latest()->first();

        if ($cart) {
            $cart->items()->detach(); // removes all pivot records
        }

        return redirect()->back()->with('success', 'Cart cleared!');
    }
}