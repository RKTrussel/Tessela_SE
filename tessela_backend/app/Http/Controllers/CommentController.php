<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Blog;

class CommentController extends Controller
{
    // Build a display name from whatever fields your Account has
    private function displayName($u): string
    {
        if (!$u) return 'Anonymous';
        $full = $u->full_name ?? null;
        $firstLast = trim(($u->first_name ?? '').' '.($u->last_name ?? ''));
        return $full
            ?: ($firstLast !== '' ? $firstLast : null)
            ?: ($u->name ?? null)
            ?: ($u->username ?? null)
            ?: ($u->email ?? null)
            ?: 'Anonymous';
    }

    // Get all comments for a blog
    public function index($blog_id)
    {
        $blog = Blog::findOrFail($blog_id);

        $comments = $blog->comments()
            ->with('user')           // eager load user
            ->latest()
            ->get()
            ->map(function ($c) {
                $author = $this->displayName($c->user);
                return [
                    'comment_id' => $c->comment_id,
                    'content'    => $c->content,
                    'author'     => $author,
                    'created_at' => $c->created_at,
                ];
            });

        return response()->json($comments);
    }

    // Store a new comment (must be logged in)
    public function store(Request $request, $blog_id)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $blog = Blog::findOrFail($blog_id);

        $comment = Comment::create([
            'blog_id' => $blog->blog_id,
            'user_id' => $user->account_id,   // adjust if your PK differs
            'content' => $request->content,
        ]);

        return response()->json([
            'comment_id' => $comment->comment_id,
            'content'    => $comment->content,
            'author'     => $this->displayName($user),
            'created_at' => $comment->created_at,
        ], 201);
    }

    // Delete a comment (optionally restrict to owner/admin)
    public function destroy(Request $request, $comment_id)
    {
        $comment = Comment::findOrFail($comment_id);

        // Uncomment to restrict deletion to owner (or add admin check)
        // $user = $request->user();
        // if (!$user || $comment->user_id !== $user->account_id) {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
