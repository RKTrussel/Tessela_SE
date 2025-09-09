<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // GET /api/products/{product_id}/reviews
    public function index($product_id, Request $request)
    {
        $product = Product::where('product_id', $product_id)->firstOrFail();

        $perPage = (int) $request->query('per_page', 10);
        $perPage = max(1, min(50, $perPage));

        // stats
        $statsQ = Review::where('product_id', $product->product_id);
        $count   = $statsQ->count();
        $average = $count ? round((float) $statsQ->avg('rating'), 1) : 0.0;

        // reviews + eager load user
        $pageObj = Review::where('product_id', $product->product_id)
            ->with('user:account_id,name')
            ->latest()
            ->paginate($perPage);

        $reviews = $pageObj->getCollection()->map(function ($r) {
            return [
                'review_id'  => (int) $r->review_id,
                'author'     => $r->user ? $r->user->name : 'Anonymous',
                'rating'     => (int) $r->rating,
                'comment'    => $r->comment,
                'created_at' => $r->created_at?->toISOString(),
            ];
        })->values();

        return response()->json([
            'average'    => $average,
            'count'      => $count,
            'reviews'    => $reviews,
            'pagination' => [
                'current_page' => $pageObj->currentPage(),
                'per_page'     => $pageObj->perPage(),
                'total'        => $pageObj->total(),
                'last_page'    => $pageObj->lastPage(),
                'next_page_url'=> $pageObj->nextPageUrl(),
                'prev_page_url'=> $pageObj->previousPageUrl(),
            ],
        ]);
    }

    // POST /api/products/{product_id}/reviews
    public function store($product_id, StoreReviewRequest $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $product = Product::where('product_id', $product_id)->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $review = Review::create([
            'product_id' => $product->product_id,
            'user_id'    => $user->account_id,
            'rating'     => (int) $request->integer('rating'),
            'comment'    => $request->input('comment'),
        ]);

        return response()->json([
            'review_id'  => (int) $review->review_id,
            'author'     => $user->name, // comes from the logged-in account
            'rating'     => (int) $review->rating,
            'comment'    => $review->comment,
            'created_at' => $review->created_at?->toISOString(),
        ], 201);
    }

    // DELETE /api/reviews/{review_id}
    public function destroy(Request $request, $review_id)
    {
        $review = Review::findOrFail($review_id);
        $user   = $request->user();

        if (!$user || ($user->account_id !== $review->user_id && $user->role !== 'admin')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}