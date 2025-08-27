<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'           => ['required','string','max:255'],
            'category'       => ['required','string','max:100'],
            'description'    => ['nullable','string'],
            'price'          => ['required','numeric','min:0'],
            'stock'          => ['required','integer','min:0'],
            'condition'      => ['required', Rule::in(['New','Used'])],
            'barcode_value'  => ['required','string','max:64','unique:products,barcode_value'],

            // here we expect real files
            'images.*'       => ['file','image','max:2048'],
        ]);

        $data['barcode_type'] = $data['barcode_type'] ?? 'CODE128';

        $product = Product::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('products', 'public'); // storage/app/public/products
                ProductImage::create([
                    'product_id' => $product->id,
                    'path'       => $path,
                    'order'      => $i,
                ]);
            }
        }

        return response()->json($product->load('images'), 201);
    }

   public function index(Request $request)
    {
        $q = Product::with('images');

        // Search filter
        if ($s = $request->query('search')) {
            $q->where(function($x) use ($s) {
                $x->where('name','like',"%{$s}%")
                ->orWhere('category','like',"%{$s}%")
                ->orWhere('barcode_value','like',"%{$s}%");
            });
        }

        // Category filter
        if ($c = $request->query('category')) {
            $q->where('category', $c);
        }

        // Sorting
        if ($sort = $request->query('sort')) {
            // Expected format: price_asc, price_desc, name_asc, name_desc
            [$field, $direction] = explode('_', $sort);
            $q->orderBy($field, $direction);
        } else {
            $q->latest('id'); // Default fallback
        }

        // Pagination
        $products = $q->paginate((int) $request->query('per_page', 10));

        // Transform images URLs
        $products->getCollection()->transform(function ($p) {
            $p->images->transform(function ($img) {
                $img->url = asset('storage/'.$img->path);
                return $img;
            });
            return $p;
        });

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('images')->find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        
        return response()->json($product);
    }


    public function update(Request $request, Product $product)
    {
        Log::info('Incoming Request Data:', $request->all());
        try {
            $data = $request->validate([
            'name'           => ['required','string','max:50'],
            'category'       => ['required','string','max:150'],
            'description'    => ['required','string','max:250'],
            'price'          => ['required','numeric','min:0'],
            'stock'          => ['required','integer','min:0'],
            'condition'      => ['required', Rule::in(['New','Used'])],
            'barcode_value'  => ['nullable','string'],
            'images.*'       => ['nullable','file','image','max:2048'],
        ]);


        } catch (ValidationException $e) {
            // Log validation errors
            Log::error('Validation Failed:', $e->errors());
            return response()->json(['error' => 'Validation failed', 'errors' => $e->errors()], 422);
        }

        // Update product data
        $product->update($data);

        // Handle image updates (if new images are uploaded)
        if ($request->hasFile('images')) {
            // Delete old images (optional if you want to delete old images)
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->path); // delete old files
                $image->delete(); // delete the image record
            }

            // Add new images
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('products', 'public'); // store in 'public' disk
                ProductImage::create([
                    'product_id' => $product->id,
                    'path'       => $path,
                    'order'      => $i,
                ]);
            }
        }

        // Return the updated product with images
        return response()->json($product->load('images'), 200);
    }

    public function destroy(Product $product)
    {
        // Delete associated images first (optional, depending on your needs)
        foreach ($product->images as $image) {
            // Delete image file from storage
            Storage::disk('public')->delete($image->path);
        }

        // Delete the product itself
        $product->delete();

        return response()->json(['message' => 'Product and its images deleted successfully']);
    }
}