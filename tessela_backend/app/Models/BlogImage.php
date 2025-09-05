<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogImage extends Model
{
    protected $primaryKey = 'blog_images_id'; // custom ID
    protected $fillable = ['blog_id', 'path', 'order'];

    public function blog()
    {
        return $this->belongsTo(Blog::class, 'blog_id', 'blog_id');
    }
}
