<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Cart extends Model
{
    protected $primaryKey = 'cart_id';
    // protected $fillable = ['account_id', 'total_price', 'status'];
    protected $fillable = ['cart_token', 'total_price'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'cart_items', 'cart_id', 'product_id')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}