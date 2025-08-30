<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    
    protected $primaryKey = "likeId";

    protected $fillable = [
        'userId',
        'blogId',
        'date',
    ];

    public function blog()
    {
        return $this->belongsTo(Blog::class, 'blogId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public static function addLike(int $userId, int $blogId): void
    {
        if(!self::isLiked($userId, $blogId)) {
            self::create([
                'userId' => $userId,
                'blogId' => $blogId,
                'date' => now(),
            ]);
        }
    }

    public static function removeLike(int $userId, int $blogId): void
    {
        self::where([
            'userId' => $userId,
            'blogId' => $blogId,
        ])->delete();
    }

    public static function isLiked(int $userId, int $blogId): bool
    {
        return self::where([
            'userId' => $userId,
            'blogId' => $blogId,
        ])->exists();
    }
}
