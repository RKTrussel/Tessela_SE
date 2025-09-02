<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    public function addItem(Request $request)
    {
        $data = $request->validate([
            'name'           => ['required','string','max:255'],
            'weaving_type'   => ['required','string','max:100'],
            'description'    => ['nullable','string'],
            'price'          => ['required','numeric','min:0'],
            'stock'          => ['required','integer','min:0'],
            'condition'      => ['required', Rule::in(['New','Used'])],
            'barcode_value'  => ['required','string','max:64','unique:products,barcode_value'],

            // here we expect real files
            'images.*'       => ['file','image','max:10240'],
        ]);

        $data['barcode_type'] = $data['barcode_type'] ?? 'CODE128';

        $product = Product::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('products', 'public'); // storage/app/public/products
                ProductImage::create([
                    'product_id' => $product->product_id,
                    'path'       => $path,
                    'order'      => $i,
                ]);
            }
        }

        return response()->json($product->load('images'), 201);
    }

    public function updateItem(Request $request, Product $product)
    {
        Log::info('Incoming Request Data:', $request->all());
        try {
            $data = $request->validate([
            'name'           => ['required','string','max:50'],
            'weaving_type'       => ['required','string','max:150'],
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
                Log::info('Deleting image:', ['image_id' => $image->id, 'path' => $image->path]);
                if ($image->path && Storage::disk('public')->exists($image->path)) {
                    // Delete image file from storage
                    Storage::disk('public')->delete($image->path);
                }

                // Delete the image record from the database
                $image->delete();
            }

            // Add new images
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('products', 'public'); // Store the image in 'products' folder
                ProductImage::create([
                    'product_id' => $product->product_id,  // Correct foreign key
                    'path'       => $path,
                    'order'      => $i,
                ]);
            }
        }

        // Return the updated product with images
        return response()->json($product->load('images'), 200);
    }

    public function deleteItem(Product $product)
    {
        // Delete associated images first
        foreach ($product->images as $image) {
            // Delete image file from storage
            Storage::disk('public')->delete($image->path);
        }

        // Delete the product itself
        $product->delete();

        return response()->json(['message' => 'Product and its images deleted successfully']);
    }
}
