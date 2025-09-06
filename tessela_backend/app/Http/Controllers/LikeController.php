<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Like;

class LikeController extends Controller
{
    public function toggle(Request $request, $blog_id)
    {
        $user = $request->user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $blog = Blog::findOrFail($blog_id);

        $like = Like::where('blog_id', $blog->blog_id)
                    ->where('user_id', $user->account_id)
                    ->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            Like::create(['blog_id' => $blog->blog_id, 'user_id' => $user->account_id]);
            $liked = true;
        }

        $count = $blog->likes()->count();
        return response()->json(['likes_count' => $count, 'liked' => $liked]);
    }
}