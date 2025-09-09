<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Account; // ← use Account, not User

class UserSeeder extends Seeder
{
    public function run(): void
    {
        Account::updateOrCreate(
            ['email' => 'tallaferkent775@gmail.com'],
            [
                'name'     => 'Kent Tallafer',
                'password' => Hash::make('password123'),
                'role'     => 'user',          // must match your DB enum/allowed values
                'gender'   => 'Male',          // nullable if not required
                'birthday' => '2004-09-09',    // YYYY-MM-DD
            ]
        );
    }
}