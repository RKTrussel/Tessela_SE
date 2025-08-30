<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogImage extends Model
{
   protected $primaryKey = 'imageId';

   protected $fillable = [
       'blogId',
       'imageUrl',
   ];

   public function blog()
   {
     return $this->belongsTo(Blog::class, 'blogId');
   }

   public static function getImage($blogId): ?string
   {
     $image = self::where('blogId', $blogId)->first();
     return $image ? $image->imageUrl : null;
   }
}
