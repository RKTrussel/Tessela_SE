<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Cart;

class Account extends Model
{
    use HasFactory;

    protected $table = 'accounts';
    protected $primaryKey = 'account_id';

    protected $fillable = ['name','email','password','role','gender','birthday'];
    
    protected $hidden = [
        'password',
    ];

    public function carts()
    {
        return $this->hasMany(Cart::class, 'account_id', 'account_id');
    }
    
    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->forceFill(['role' => class_basename(static::class)]);
        });
    }

    public static function booted()
    {
        static::addGlobalScope(static::class, function($builder) {
            $builder->where('role', class_basename(static::class)); 
        });
    }

     public function newFromBuilder($attributes = [], $connection = null)
    {
        $attributes = (array) $attributes;

        if (isset($attributes['role'])) {
            if ($attributes['role'] === 'admin') {
                $model = new Admin;
            } else {
                $model = new User;
            }
        } else {
            $model = new static;
        }

        $model->exists = true;
        $model->setRawAttributes($attributes, true);
        $model->setConnection($connection ?: $this->getConnectionName());

        return $model;
    }

    public static function login(string $email, string $password): ?array
    {
        $row = DB::table('accounts')->where('email', $email)->first();

        if (!$row || !Hash::check($password, $row->password)) {
            return null;
        }

        // Generate random token
        $token = bin2hex(random_bytes(32));

        // Store in tokens table
        DB::table('account_tokens')->insert([
            'account_id' => $row->account_id,
            'token' => $token,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Return both account and token
        $account = $row->role === 'admin'
            ? Admin::find($row->account_id)
            : User::find($row->account_id);

        return [
            'user' => $account,
            'token' => $token,
        ];
    }


    public static function register($name, $email, $password, $birthday, $gender, $role ): bool
    {
        try 
        {
            User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'birthday' => $birthday,
                'gender'   => $gender,
                'role' => $role,
            ]);

            return true;
        } 
        catch (\Exception $e) 
        {
            return false;
        }
    }


    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'account_id');
    }
}
