<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        $freelancer = User::factory()->count(15)->create([
            'type' => 'freelancer'
        ]);

        $company = User::factory()->count(5)->create([
            'type' => 'company'
        ]);

        $customers = User::factory()->count(20)->create([
            'type' => 'customer'
        ]);
    }
}
