<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Blog;

class CommentController extends Controller
{
    // Get all comments for a blog
    public function index($blog_id)
    {
        $blog = Blog::findOrFail($blog_id);

        $comments = $blog->comments()
            ->with('user') // eager load user
            ->latest()
            ->get()
            ->map(function ($c) {
                return [
                    'comment_id' => $c->comment_id,
                    'content'    => $c->content,
                    'author'     => $c->user ? $c->user->name : null, // Get name from accounts table
                    'created_at' => $c->created_at,
                ];
            });

        

        return response()->json($comments);
    }

    // Store a new comment (must be logged in)
    public function store(Request $request, $blog_id)
    {
        // Validate request
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        // Ensure user is authenticated
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Ensure blog exists
        $blog = Blog::find($blog_id);
        if (!$blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        // Create comment
        $comment = Comment::create([
            'blog_id' => $blog->blog_id,
            'user_id' => $user->account_id, // Match your DB column name
            'content' => $request->content,
        ]);

        // Respond with structured data for frontend
        return response()->json([
            'comment_id' => $comment->comment_id,
            'author'     => $user->name,
            'content'    => $comment->content,
            'created_at' => $comment->created_at->toDateTimeString(),
        ], 201);
    }

    // Delete a comment
    public function destroy(Request $request, $comment_id)
    {
        $comment = Comment::findOrFail($comment_id);

        // Optional: restrict deletion to owner or admin
        // $user = $request->user();
        // if (!$user || $comment->userId !== $user->account_id) {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}