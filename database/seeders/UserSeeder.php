<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin (realistic)
        User::create([
            'name'     => 'Super Administrator',
            'email'    => 'super@admin.com',
            'password' => Hash::make('super123'),
            'role'     => 'admin',
            'status'   => 'active',
        ]);

        // Other role examples
        $roles = [
            'staff'     => 'Staff User',
            
        ];

        foreach ($roles as $role => $name) {
            User::create([
                'name'     => $name,
                'email'    => $role . '@example.com',
                'password' => Hash::make('password123'),
                'role'     => $role,
                'status'   => 'active',
            ]);
        }
    }
}