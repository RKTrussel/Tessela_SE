<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Models\ProductImage;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $json = File::get(database_path('data/products.json'));
        $products = json_decode($json, true);
        
        foreach ($products as $index => $item)
        {
            $product = Product::create([
                'name' => $item['name'],
                'weaving_type' => $item['weaving_type'],
                'description' => $item['description'],
                'price' => $item['price'],
                'stock' => $item['stock'],
                'condition' => $item['condition'],
                'barcode_value' => $item['barcode'],
            ]);

            if(isset($item['images']) && is_array($item['images'])) {
                foreach ($item['images'] as $i => $path) {
                    ProductImage::create([
                        'product_id' => $product->product_id,
                        'path' => $path,
                        'order' => $i,
                    ]);
                }
            }
        }
    }
}
