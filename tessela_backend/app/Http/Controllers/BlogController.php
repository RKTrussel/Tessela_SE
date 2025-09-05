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
        $blogs = Blog::with('images')->get();

        // Only send image paths
        $blogs->transform(function ($blog) {
            $blog->images = $blog->images->pluck('path'); 
            return $blog;
        });

        return response()->json($blogs);
    }

    // Show single blog
    public function show($blog_id)
    {
        $blog = Blog::with('images')->findOrFail($blog_id);
        $blog->images = $blog->images->pluck('path'); // Only paths
        return response()->json($blog);
    }

    // Store new blog
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|string',
            'images.*' => 'nullable|image|max:2048', // max 2MB per image
        ]);

        // Convert date to YYYY-MM-DD
        try {
            $date = Carbon::createFromFormat('m/d/Y', $request->date)->format('Y-m-d');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid date format'], 422);
        }

        // Create blog
        $blog = Blog::create([
            'title' => $request->title,
            'author' => $request->author,
            'content' => $request->content,
            'date' => $date,
        ]);

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $idx => $image) {
                $path = $image->store('blogs', 'public'); // stores in storage/app/public/blogs
                BlogImage::create([
                    'blog_id' => $blog->blog_id,
                    'path' => $path,
                    'order' => $idx + 1,
                ]);
            }
        }

        return response()->json(['message' => 'Blog created successfully', 'blog' => $blog], 201);
    }

    // Delete blog
    public function destroy($blog_id)
    {
        $blog = Blog::findOrFail($blog_id);
        
        // Delete associated images files from storage
        foreach ($blog->images as $img) {
            Storage::disk('public')->delete($img->path);
        }

        $blog->delete();

        return response()->json(['message' => 'Blog deleted successfully']);
    }
}