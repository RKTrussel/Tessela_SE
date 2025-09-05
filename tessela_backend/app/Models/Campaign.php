<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $primaryKey = 'campaign_id';
    protected $fillable = [
        'name', 'goalAmount', 'description',
        'start_date', 'end_date', 'status'
    ];

    public function images()
    {
        return $this->hasMany(CampaignImage::class, 'campaign_id')
                    ->orderBy('order');
    }
}