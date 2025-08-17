<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
            'condition'      => ['required', Rule::in(['New','used'])],
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
}