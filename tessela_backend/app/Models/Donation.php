<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Campaign;
use App\Models\Account;

class Donation extends Model
{
    protected $primaryKey = 'donation_id';
    protected $fillable = [
        'campaign_id', 'user_id', 'amount', 'payment_status', 'payment_ref', 'message'
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id', 'campaign_id');
    }

    // points to accounts table (PK: account_id)
    public function user()
    {
        return $this->belongsTo(Account::class, 'user_id', 'account_id');
    }
}
