<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignImage extends Model
{
    use HasFactory;

    protected $primaryKey = 'image_id';
    protected $fillable = ['campaign_id', 'image_path', 'order'];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }
}