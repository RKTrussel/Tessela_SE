<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $primaryKey = 'cart_id';
    protected $fillable = ['account_id', 'total_price'];

    public function items()
    {
        // Assuming pivot table is cart_items with fields: cart_id, product_id, quantity
        return $this->belongsToMany(Product::class, 'cart_items', 'cart_id', 'product_id')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
