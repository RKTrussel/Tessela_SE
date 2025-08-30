<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use \App\Models\Cart;
use \App\Models\Item;

class CartItem extends Model
{
    protected $table = 'cart_items';
    protected $fillable = ['cart_id', 'item_id', 'quantity'];

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}