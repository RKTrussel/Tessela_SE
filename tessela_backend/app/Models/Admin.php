<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cart;

class Admin extends Account
{
    protected $table = 'accounts';
    protected $primaryKey = 'account_id';

    protected $fillable = ['name','email','password','role','gender','birthday'];

    /**
     * Create a new blog post.
     *
     * @param string $title
     * @return void
     */

    public function carts()
    {
        return $this->hasMany(Cart::class, 'account_id');
    }

    public function createBlog(Blog $blog): void
    {
        $blog->created_by = $this->id;
        $blog->save();
    }

    /**
     * Delete a blog post.
     *
     * @param int $id
     * @return void
     */
    public function deleteBlog($blogId): void
    {
        Blog::destroy($blogId);
    }

    /**
     * Update a blog post.
     *
     * @param Blog $blog
     * @return void
     */
    public function updateBlog(Blog $blog): void
    {
        $existingBlog = Blog::find($blog->blogId);

        if ($existingBlog) {
            $existingBlog->update($blog->toArray());
        }
    }

}