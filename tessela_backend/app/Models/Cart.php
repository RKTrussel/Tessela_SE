<?php

// Cart.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $primaryKey = 'cart_id';

    public function user()
    {
        return $this->belongsTo(Account::class, 'account_id', 'account_id');
    }

    public function items()
    {
        return $this->belongsToMany(Item::class, 'cart_items', 'cart_id', 'item_id')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}