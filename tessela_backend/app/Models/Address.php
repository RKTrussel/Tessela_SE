<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $primaryKey = 'address_id';

    protected $fillable = [
        'account_id',
        'name',
        'phone',
        'email',
        'address_line1',
        'city',
        'province',
        'postal_code',
        'is_default',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }
}
