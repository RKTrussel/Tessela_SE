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
    ];

    protected $hidden = [
        'password',
    ];

    public static function login($email, $password): bool
    {
        return Auth::attempt(['email' => $email, 'password' => $password]);
    }

    public static function register($name, $email, $password, $role): bool
    {
        try {
            self::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => $role,
            ]);
            return true;
        } catch (\Exception $e) {
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
