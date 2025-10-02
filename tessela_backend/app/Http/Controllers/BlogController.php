<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\User;
use App\Models\BlogImage;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Notifications\BlogApproved;
use App\Notifications\BlogRejected;

class BlogController extends Controller
{
    // List all blogs
    public function index()
    {
        $blogs = Blog::with('images')
            ->withCount('likes')
            ->where('status', 'published')
            ->get()
            ->map(function ($blog) {
                $blog->images = $blog->images->map(function ($img) {
                    $img->url = asset('storage/' . $img->path);
                    return $img;
                });
                return $blog;
            });

        return response()->json($blogs);
    }

    // BlogController.php
    public function adminIndex()
    {
        $blogs = Blog::with('images')
            ->withCount('likes')
            ->get()
            ->map(function ($blog) {
                $blog->images = $blog->images->map(function ($img) {
                    $img->url = asset('storage/' . $img->path);
                    return $img;
                });
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
            'images'      => $blog->images,   
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
            'status'    => 'required|in:draft,published',
            'images.*'  => 'nullable|image|max:2048',
        ]);

        try {
            $date = Carbon::createFromFormat('m/d/Y', $request->date)->format('Y-m-d');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid date format'], 422);
        }

        $user = $request->user(); // ✅ logged-in user

        if (!$user) {
            return response()->json(['error' => 'Unauthorized. Please log in.'], 401);
        }

        $blog = Blog::create([
            'user_id' => $user->account_id,
            'title'   => $request->title,
            'author'  => $request->author,
            'content' => $request->content,
            'date'    => $date,
            'status'  => $request->status,
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

    // Update blog
   public function update(Request $request, Blog $blog)
    {
        $request->validate([
            'title'   => 'sometimes|required|string|max:255',
            'author'  => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'date'    => 'sometimes|required|string',
            'status'  => 'sometimes|required|in:draft,published',
            'images.*'=> 'nullable|image|max:2048',
        ]);

        if ($request->has('title')) $blog->title = $request->title;
        if ($request->has('author')) $blog->author = $request->author;
        if ($request->has('content')) $blog->content = $request->content;
        if ($request->has('status')) $blog->status = $request->status;

        if ($request->has('date')) {
            try {
                $blog->date = \Carbon\Carbon::createFromFormat('m/d/Y', $request->date)
                    ->format('Y-m-d');
            } catch (\Exception $e) {
                return response()->json(['error' => 'Invalid date format'], 422);
            }
        }

        $blog->save();


        // Replace images if new ones uploaded
        if ($request->hasFile('images')) {
            // delete old images
            foreach ($blog->images as $img) {
                Storage::disk('public')->delete($img->path);
                $img->delete();
            }

            // store new ones
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
            'message' => 'Blog updated successfully',
            'blog'    => $blog,
        ]);
    }

    public function approve($id)
    {
        $blog = Blog::with('user')->findOrFail($id);
        $blog->status = 'published';
        $blog->save();

        if ($blog->user) {
            $blog->user->notify(new BlogApproved($blog));
        }

        return response()->json(['message' => 'Blog approved and author notified']);
    }

    public function reject($id)
    {
        $blog = Blog::with('user')->findOrFail($id);
        $blog->status = 'rejected';
        $blog->save();

        if ($blog->user) {
            $blog->user->notify(new BlogRejected($blog));
        }

        return response()->json(['message' => 'Blog rejected and author notified']);
    }
}