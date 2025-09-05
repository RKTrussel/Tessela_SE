<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $primaryKey = 'blog_id'; // custom ID
    protected $fillable = ['title', 'author', 'content', 'date'];

    public function images()
    {
        return $this->hasMany(BlogImage::class, 'blog_id', 'blog_id')->orderBy('order');
    }
}
