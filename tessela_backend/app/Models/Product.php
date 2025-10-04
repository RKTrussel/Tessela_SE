<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImage;
use App\Models\Cart;
use App\Models\Review;

class Product extends Model
{
    protected $primaryKey = 'product_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'name', 'weaving_type', 'description', 'price', 'stock', 'condition', 'barcode_value'
    ];

    // Include custom attributes in API JSON
    protected $appends = ['content_quality', 'image_url'];

    public function reviews()
    {
        return $this->hasMany(Review::class, 'product_id', 'product_id');
    }

    // Relationships
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'product_id')->orderBy('order');
    }

    public function carts()
    {
        return $this->belongsToMany(Cart::class, 'cart_items', 'product_id', 'cart_id')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'product_id', 'product_id');
    }

    // ✅ Automatically include one image (main image)
    public function getImageUrlAttribute()
    {
        // If images are already loaded, get first one
        if ($this->relationLoaded('images') && $this->images->isNotEmpty()) {
            return $this->images->first()->url;
        }

        // Otherwise fetch from DB once
        $image = $this->images()->first();
        if ($image) {
            return $image->url;
        }

        // Default fallback
        return asset('no-image.png'); // Or use a CDN path if needed
    }

    // 🔹 Content Quality Attribute (yours)
    public function getContentQualityAttribute(): int
    {
        $score = 0;

        if ($this->name && mb_strlen(trim($this->name)) >= 8) $score += 10;

        $len = $this->description ? mb_strlen(trim($this->description)) : 0;
        if     ($len >= 200) $score += 25;
        elseif ($len >= 80)  $score += 15;
        elseif ($len >= 1)   $score += 5;

        $count = $this->relationLoaded('images') ? $this->images->count() : 0;
        if     ($count >= 3) $score += 25;
        elseif ($count >= 1) $score += 15;

        if (!empty($this->weaving_type))      $score += 5;
        if ((float)$this->price > 0)          $score += 5;
        if ((int)$this->stock >= 1)           $score += 5;
        if (!empty($this->barcode_value))     $score += 5;

        if (in_array($this->condition, ['New','Used'], true)) $score += 5;

        if ($this->name && mb_strlen($this->name) <= 70) $score += 5;

        return min(100, $score);
    }
}