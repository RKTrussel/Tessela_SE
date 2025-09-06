<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CampaignImage;
use App\Models\Donation;

class Campaign extends Model
{
    use HasFactory;

    // ✅ Tell Eloquent the primary key column
    protected $primaryKey = 'campaign_id';

    // ✅ It’s an auto-incrementing integer
    public $incrementing = true;
    protected $keyType = 'int';

    // ✅ Allow mass-assignment for these fields
    protected $fillable = [
        'name',
        'goalAmount',
        'description',
        'start_date',
        'end_date',
        'status',
    ];

    // ✅ Make route model binding use campaign_id instead of "id"
    public function getRouteKeyName()
    {
        return 'campaign_id';
    }

    // Relationships
    public function images()
    {
        return $this->hasMany(CampaignImage::class, 'campaign_id', 'campaign_id');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'campaign_id', 'campaign_id');
    }
}