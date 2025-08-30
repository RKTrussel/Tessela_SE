<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

abstract class Account extends Model
{
    use HasFactory;

    protected $table = 'accounts';

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
            $class = match ($attributes['role']) {
                'admin' => Admin::class,
                'user'  => User::class,
                default => self::class,
            };
            return (new $class)->newFromBuilder($attributes, $connection);
        }

        return parent::newFromBuilder($attributes, $connection);
    }

    public static function login(string $email, string $password): ?self
    {
       $account = static::where('email', $email)->first();

       if($account && Hash::check($password, $account->password))
        {
            Auth::login($account);
            return $account;
        }
        
       return null;
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
