<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $primaryKey = 'commentId';

    protected $fillable = [
        'userId',
        'blogId',
        'content',
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

    public function editComment(string $newContent): void
    {
        $this->update(['content' => $newContent]);
    }

    public function deleteComment(): void
    {
        $this->delete();
    }

    public function displayComment(): string
    {
        return "{$this->user->name}: {$this->content}";
    }
}
