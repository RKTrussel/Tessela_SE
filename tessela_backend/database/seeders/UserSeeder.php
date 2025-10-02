<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Account;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        Account::create([
            'name'     => 'Kent Tallafer',
            'email'    => 'tallaferkent775@gmail.com',
            'password' => Hash::make('password123'),
            'role'     => 'user',
            'gender'   => 'Male',
            'birthday' => '2004-09-09',
            'email_verified_at' => now(),
        ]);
    }
}
