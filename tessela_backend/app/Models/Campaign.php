<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CampaignImage;
use App\Models\Donation;

class Campaign extends Model
{
    protected $primaryKey = 'campaign_id'; // your key column
    public $incrementing = true;           // set false if UUID
    protected $keyType = 'int';            // 'string' if UUID

    protected $fillable = [
        'name',
        'description',
        'status',
        'start_date',
        'end_date',
        'goalAmount',
        'closed_at', // ✅ make sure this is fillable
    ];

    protected $casts = [
        'closed_at' => 'datetime', // ✅ auto-cast to Carbon
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    // Use campaign_id for implicit route model binding
    public function getRouteKeyName()
    {
        return 'campaign_id';
    }

    public function images()
    {
        return $this->hasMany(CampaignImage::class, 'campaign_id', 'campaign_id');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'campaign_id', 'campaign_id');
    }
}