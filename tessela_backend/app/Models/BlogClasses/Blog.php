<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
   protected $primaryKey = 'blogId';

   protected $fillable = [
        'title',
        'content',
        'dateCreated',
   ];

   public function admin()
   {
    return $this->belongsTo(Account::class, 'created_by');
   }

   public function images()
   {
    return $this->hasMany(BlogImage::class, 'blogId');
   }

   public function comments()
   {
    return $this->hasMany(Comment::class, 'blogId');
   }

   public function likes()
   {
    return $this->hasMany(Like::class, 'blogId');
   }

   public function addImage(BlogImage $image): void
   {
     $this->images()->save($image);
   }

   public function getComments()
   {
    return $this->comments()->get();
   }

   public function getLikes(): int
   {
     return $this->likes()->count();
   }
}
