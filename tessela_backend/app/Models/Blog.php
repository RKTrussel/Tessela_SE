<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\BlogImage;
use App\Models\Comment;
use App\Models\Like;
use App\Models\User; 

class Blog extends Model
{
    protected $primaryKey = 'blog_id';
    public $incrementing = true;    
    protected $keyType = 'int';       
    protected $fillable = ['title', 'author', 'content', 'date', 'status', 'user_id'];

    public function images()
    {
        return $this->hasMany(BlogImage::class, 'blog_id', 'blog_id')->orderBy('order');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'blog_id', 'blog_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'blog_id', 'blog_id');
    }

    public function getRouteKeyName()
    {
        return 'blog_id';
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'account_id');
    }
}