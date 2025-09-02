<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Product;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $account = $request->user();

        Log::info('Incoming address request:', $request->all());

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
            
            Log::info('Resolved cart in OrderController@store:', [
                'account_id' => $account->account_id,
                'cart'       => $cart,
                'cart_id'    => $cart?->cart_id,
            ]);

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

                // 🔹 Decrement stock
                $product = Product::find($item['product_id']);
                if ($product) {
                    // Prevent negative stock
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Not enough stock for product {$product->name}");
                    }

                    $product->decrement('stock', $item['quantity']);
                }
            }

            // remove purchased items from cart
            if ($cart) {
                $cart->items()->detach(collect($data['items'])->pluck('product_id'));
            }


            return $order->load('items.product');
        });

        return response()->json([
            'message' => 'Order placed successfully!',
            'order' => $order,
        ], 201);
    }

   public function index(Request $request)
    {
        $account = $request->user();

        $query = Order::with('items.product')
            ->orderByDesc('created_at');

        // 🔹 If not admin, only fetch their orders
        if ($account->role !== 'admin') {
            $query->where('account_id', $account->account_id);
        }

        $statusMap = [
            'To Ship'   => 'pending',
            'Processed' => 'processed',
        ];

        if ($request->has('status') && $request->status !== 'All') {
            $mappedStatus = $statusMap[$request->status] ?? $request->status;
            $query->where('status', $mappedStatus);
        }

        if ($request->has('order_id')) {
            $query->where('order_id', $request->order_id);
        }

        if ($request->has('priority') && $request->priority !== 'All') {
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

        return response()->json($order->load('items.product'));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $account = $request->user();

        $request->validate([
            'status' => 'required|string|in:pending,processed,shipped,delivered',
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order'   => $order->fresh('items.product'),
        ]);
    }

}