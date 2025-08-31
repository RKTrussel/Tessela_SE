<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Item;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->get('auth_user'); 
        
        $cart = $user?->carts()->latest()
            ->with(['items.images' => fn($q) => $q->orderBy('order')])
            ->first();

        if (!$cart) {
            return response()->json([
                'cart_id'     => null,
                'total_price' => 0,
                'items'       => [],
            ]);
        }

        $items = $cart->items->map(function ($p) {
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
            'total_price' => (float) $items->sum('subtotal'),
            'items'       => $items,
        ]);
    }

    public function removeItem(Request $request, $itemId)
    {
        $user = $request->get('auth_user');
        $cart = $user?->carts()->latest()->first();

        if ($cart) {
            $cart->items()->detach($itemId);
        }

        return response()->json(['success' => true, 'message' => 'Item removed']);
    }

    public function clear(Request $request)
    {
        $user = $request->get('auth_user');
        $cart = $user?->carts()->latest()->first();

        if ($cart) {
            $cart->items()->detach();
        }

        return response()->json(['success' => true, 'message' => 'Cart cleared']);
    }

    public function updateItem(Request $request, $itemId)
    {
        $user = $request->get('auth_user');
        $cart = $user?->carts()->latest()->first();

        if (!$cart) {
            return response()->json(['success' => false, 'message' => 'Cart not found'], 404);
        }

        $quantity = max(1, (int) $request->input('quantity'));

        $cart->items()->updateExistingPivot($itemId, ['quantity' => $quantity]);

        return response()->json(['success' => true, 'message' => 'Quantity updated']);
    }
}
