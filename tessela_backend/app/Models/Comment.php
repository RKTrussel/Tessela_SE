<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Blog;
use App\Models\Account;

class Comment extends Model
{
    protected $primaryKey = 'comment_id';
    protected $fillable = ['user_id', 'blog_id', 'content'];

    public function blog()
    {
        return $this->belongsTo(Blog::class, 'blog_id', 'blog_id');
    }

    public function user()
    {
        return $this->belongsTo(Account::class, 'user_id', 'account_id'); 
    }
}