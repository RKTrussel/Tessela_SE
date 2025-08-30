<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class Account extends Model
{
    use HasFactory;

    protected $table = 'accounts';
    protected $primaryKey = 'account_id';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];
    
    protected $hidden = [
        'password',
    ];
    
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

    public static function login(string $email, string $password): ?Account
    {
        
        $row = DB::table('accounts')->where('email', $email)->first();

        if (!$row || !Hash::check($password, $row->password)) {
            return null;
        }
        
        if ($row->role === 'admin') {
            return Admin::find($row->account_id);
        } else {
            return User::find($row->account_id);
        }
    }

    public static function register($name, $email, $password, $role): bool
    {
        try 
        {
            $class = $role === 'admin' ? Admin::class : User::class;

            $class::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => $role,
            ]);

            return true;
        } 
        catch (\Exception $e) 
        {
            return false;
        }
    }

    public static function logout(): bool
    {
        Auth::logout();
        return true;
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }


}
