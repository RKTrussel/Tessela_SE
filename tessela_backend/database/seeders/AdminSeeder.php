<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create or update a default admin account
        Admin::updateOrCreate(
            ['email' => 'tallaferkent775@gmail.com'],     // unique by email
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'), // change this
                'role' => 'admin',
                'gender' => 'Male',                     // or null
                'birthday' => '1990-01-01',            // YYYY-MM-DD
                'email_verified_at' => now(), 
            ]
        );
    }
}
