<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use \App\Models\Product;

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';
    protected $primaryKey = 'review_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['product_id', 'user_id', 'rating', 'comment'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'account_id');
    }
}