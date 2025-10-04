<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class ProductImage extends Model
{
    protected $primaryKey = 'product_images_id';

    protected $fillable = ['product_id','path','order','url'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }


}