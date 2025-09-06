<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\BlogImage;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class BlogController extends Controller
{
    // List all blogs
    public function index()
    {
        // include likes count
        $blogs = Blog::with('images')
            ->withCount('likes')
            ->get();

        // normalize images to include full URL
        $blogs->transform(function ($blog) {
            $blog->images = $blog->images->map(function ($img) {
                $img->url = asset('storage/' . $img->path);
                return $img;
            });
            // expose likes_count as integer (already present from withCount)
            return $blog;
        });

        return response()->json($blogs);
    }

    // One blog
    public function show($blog_id)
    {
        $blog = Blog::with('images')
            ->withCount('likes') // adds $blog->likes_count
            ->findOrFail($blog_id);

        // normalize images to objects with url (NOT array of strings)
        $blog->images = $blog->images->map(function ($img) {
            $img->url = asset('storage/' . $img->path);
            return $img;
        })->values(); // keep it as a collection of model objects

        // liked flag if request has an authenticated user (token on GET is fine)
        $liked = false;
        if ($user = request()->user()) {
            $liked = $blog->likes()
                ->where('user_id', $user->account_id) // change if using users.id
                ->exists();
        }

        return response()->json([
            'blog_id'     => $blog->blog_id,
            'title'       => $blog->title,
            'author'      => $blog->author,
            'content'     => $blog->content,
            'date'        => $blog->date,
            'images'      => $blog->images,   // array of objects w/ url
            'likes_count' => (int) $blog->likes_count,
            'liked'       => $liked,
        ]);
    }

    // Store new blog
    public function store(Request $request)
    {
        $request->validate([
            'title'     => 'required|string|max:255',
            'author'    => 'required|string|max:255',
            'content'   => 'required|string',
            'date'      => 'required|string',
            'images.*'  => 'nullable|image|max:2048',
        ]);

        try {
            $date = Carbon::createFromFormat('m/d/Y', $request->date)->format('Y-m-d');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid date format'], 422);
        }

        $blog = Blog::create([
            'title'   => $request->title,
            'author'  => $request->author,
            'content' => $request->content,
            'date'    => $date,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $idx => $image) {
                $path = $image->store('blogs', 'public');
                BlogImage::create([
                    'blog_id' => $blog->blog_id,
                    'path'    => $path,
                    'order'   => $idx + 1,
                ]);
            }
        }

        $blog->load('images');
        $blog->images = $blog->images->map(function ($img) {
            $img->url = asset('storage/' . $img->path);
            return $img;
        });

        return response()->json([
            'message' => 'Blog created successfully',
            'blog'    => $blog
        ], 201);
    }

    // Delete blog
    public function destroy($blog_id)
    {
        $blog = Blog::with('images')->findOrFail($blog_id);

        foreach ($blog->images as $img) {
            Storage::disk('public')->delete($img->path);
            $img->delete();
        }

        $blog->delete();

        return response()->json(['message' => 'Blog deleted successfully']);
    }
}