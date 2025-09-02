<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $primaryKey = 'order_id'; 

    protected $fillable = [
        'account_id', 'cart_id','status', 'subtotal', 'shipping_fee', 'total',
        'payment_method',
        'full_name', 'email', 'phone', 'address_line1',
        'city', 'province', 'postal_code'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    public function getRouteKeyName()
    {
        return 'order_id';
    }
}
