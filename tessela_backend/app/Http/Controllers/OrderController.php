<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $account = $request->user();

        Log::info('Incoming order request:', $request->all());

        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,product_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',

            'shipping.full_name' => 'required|string',
            'shipping.email' => 'nullable|email',
            'shipping.phone' => 'required|string',
            'shipping.address_line1' => 'required|string',
            'shipping.city' => 'required|string',
            'shipping.province' => 'required|string',
            'shipping.postal_code' => 'required|string',

            'payment.method' => 'required|string',
            'amounts.subtotal' => 'required|numeric',
            'amounts.shipping_fee' => 'required|numeric',
            'amounts.total' => 'required|numeric',
        ]);

        $order = DB::transaction(function () use ($account, $data) {
            $cart = $account->carts()->latest()->first();

            $order = Order::create([
                'account_id'     => $account->account_id,
                'cart_id'        => $cart?->cart_id,
                'status'         => 'pending',
                'subtotal'       => $data['amounts']['subtotal'],
                'shipping_fee'   => $data['amounts']['shipping_fee'],
                'total'          => $data['amounts']['total'],
                'payment_method' => $data['payment']['method'],
                'full_name'      => $data['shipping']['full_name'],
                'email'          => $data['shipping']['email'] ?? null,
                'phone'          => $data['shipping']['phone'],
                'address_line1'  => $data['shipping']['address_line1'],
                'city'           => $data['shipping']['city'],
                'province'       => $data['shipping']['province'],
                'postal_code'    => $data['shipping']['postal_code'],
            ]);

            foreach ($data['items'] as $item) {
                OrderItem::create([
                    'order_id'   => $order->order_id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);

                // 🔹 Update product stock safely
                $product = Product::find($item['product_id']);
                if ($product) {
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Not enough stock for product {$product->name}");
                    }
                    $product->decrement('stock', $item['quantity']);
                }
            }

            // 🔹 Remove purchased items from cart
            if ($cart) {
                $cart->items()->detach(collect($data['items'])->pluck('product_id'));
            }

            return $order->load('items.product.images');
        });

        return response()->json([
            'message' => 'Order placed successfully!',
            'order'   => $order,
        ], 201);
    }

    public function index(Request $request)
    {
        $account = $request->user();

        $query = Order::with([
            'items.product' => function ($q) use ($account) {
                // Eager-load product images
                $q->with('images');

                // ✅ Include only the logged-in user's review (if any)
                $q->with(['reviews' => function ($r) use ($account) {
                    $r->where('user_id', $account->account_id)
                      ->select('review_id', 'product_id', 'user_id', 'rating', 'comment', 'created_at');
                }]);
            }
        ])->orderByDesc('created_at');

        // Restrict to own orders (unless admin)
        if ($account->role !== 'admin') {
            $query->where('account_id', $account->account_id);
        }

        // Handle filters
        $statusMap = [
            'To Ship'   => 'pending',
            'Processed' => 'processed',
        ];

        if ($request->filled('status') && $request->status !== 'All') {
            $mappedStatus = $statusMap[$request->status] ?? $request->status;
            $query->where('status', $mappedStatus);
        }

        if ($request->filled('order_id')) {
            $query->where('order_id', $request->order_id);
        }

        if ($request->filled('priority') && $request->priority !== 'All') {
            if ($request->priority === 'Ship By Today') {
                $query->whereDate('created_at', today());
            } elseif ($request->priority === 'Ship By Tomorrow') {
                $query->whereDate('created_at', today()->addDay());
            }
        }

        return response()->json($query->get());
    }

    public function show(Order $order, Request $request)
    {
        $account = $request->user();

        if ($order->account_id !== $account->account_id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // ✅ Load images and only current user's review
        $order->load([
            'items.product.images',
            'items.product.reviews' => function ($r) use ($account) {
                $r->where('user_id', $account->account_id)
                  ->select('review_id', 'product_id', 'user_id', 'rating', 'comment', 'created_at');
            },
        ]);

        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,processed,shipped,delivered',
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order'   => $order->fresh('items.product.images'),
        ]);
    }
}