<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;
use App\Models\Item;

class CartController extends Controller
{
    // Show the user's current cart
    public function show()
    {
        $user = Auth::user();

        $cart = $user->carts()->latest()->first();
        $items = $cart ? $cart->items : collect();

        $total = $items->sum(function($item) {
            return $item->price * $item->pivot->quantity;
        });

        return view('cart.index', compact('cart', 'items', 'total'));
    }

    // Add an item to cart
    public function addItem(Request $request, $itemId)
    {
        $user = Auth::user();
        $item = Item::findOrFail($itemId);

        // Get or create a cart
        $cart = $user->carts()->latest()->first();
        if (!$cart) {
            $cart = Cart::create([
                'account_id' => $user->id,
                'total_price' => 0
            ]);
        }

        // Add item or increase quantity
        if ($cart->items()->where('item_id', $itemId)->exists()) {
            $cart->items()->updateExistingPivot($itemId, [
                'quantity' => $cart->items()->where('item_id', $itemId)->first()->pivot->quantity + 1
            ]);
        } else {
            $cart->items()->attach($itemId, ['quantity' => 1]);
        }

        return redirect()->back()->with('success', 'Item added to cart!');
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