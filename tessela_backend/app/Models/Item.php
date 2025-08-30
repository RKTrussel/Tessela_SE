<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use \App\Models\Cart;

class Item extends Model
{
    protected $table = 'items';
    protected $primaryKey = 'item_id'; // <- set this to your actual PK
    public $incrementing = true; // or false if it's not auto-increment
    protected $keyType = 'int'; // or 'string' if PK is varchar
    Protected $fillable = ['name', 'price', 'image', 'variation'];

    public function carts()
    {
        return $this->belongsToMany(Cart::class, 'cart_items', 'item_id', 'cart_id')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
