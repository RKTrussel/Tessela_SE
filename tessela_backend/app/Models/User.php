<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Cart;
use App\Models\Blog; 

class User extends Account
{
    use HasFactory;

    protected $table = 'accounts';

    protected $fillable = ['name','email','password','role','gender','birthday'];
    
    public function blogs()
    {
        return $this->hasMany(Blog::class, 'user_id', 'account_id');
    }


    public function carts()
    {
        return $this->hasMany(Cart::class, 'account_id', 'account_id');
    }

    // ------------------------------------
    //   RELATIONSHIPS (BLOG CLASS [LIKE, COMMENT])
    // ------------------------------------
    public function likes()
    {
        return $this->hasMany(Like::class, 'userId');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'userId');
    }

    // ------------------------------------
    //   METHODS (BLOG CLASS)
    // ------------------------------------
    public function likeBlog(Blog $blog): void
    {
       if ($this->hasLikedBlog($blog)) {
        Like::removeLike($this->id, $blog->blogId);
       } else {
        Like::addLike($this->id, $blog->blogId);
       }
    }

    public function hasLikedBlog(Blog $blog): bool
    {
        return Like::isLiked($this->id, $blog->blogId);
    }

    public function commentBlog(Blog $blog, string $content): void
    {
        Comment::create([
            'userId' => $this->id,
            'blogId' => $blog->id,
            'content' => $content,
        ]);
    }

}
