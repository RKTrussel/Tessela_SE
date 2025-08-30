<?php

// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImage;
use App\Models\Cart;

class Product extends Model
{
    protected $fillable = [
        'name','category','description','price','stock','condition','barcode_value'
    ];

    // Make it show up in JSON automatically
    protected $appends = ['content_quality'];

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function carts()
    {
        return $this->belongsToMany(Cart::class, 'cart_items', 'product_id', 'cart_id')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

    public function getContentQualityAttribute(): int
    {
        $score = 0;

        // Title length
        if ($this->name && mb_strlen(trim($this->name)) >= 8) $score += 10;

        // Description length
        $len = $this->description ? mb_strlen(trim($this->description)) : 0;
        if     ($len >= 200) $score += 25;
        elseif ($len >= 80)  $score += 15;
        elseif ($len >= 1)   $score += 5;

        // Images count
        $count = $this->relationLoaded('images') ? $this->images->count() : 0;
        if     ($count >= 3) $score += 25;
        elseif ($count >= 1) $score += 15;

        // Required fields
        if (!empty($this->category))      $score += 5;
        if ((float)$this->price > 0)      $score += 5;
        if ((int)$this->stock >= 1)       $score += 5;
        if (!empty($this->barcode_value)) $score += 5;

        // Condition valid
        if (in_array($this->condition, ['New','used'], true)) $score += 5;

        // Title readability (not too long)
        if ($this->name && mb_strlen($this->name) <= 70) $score += 5;

        return min(100, $score);
    }
}
