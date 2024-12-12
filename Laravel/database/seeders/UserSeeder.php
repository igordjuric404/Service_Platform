<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        $freelancer = User::factory()->create([
            'type' => 'freelancer'
        ]);

        $company = User::factory()->create([
            'type' => 'company'
        ]);

        $customers = User::factory()->count(3)->create([
            'type' => 'customer'
        ]);

        $this->command->info("Freelancer: $freelancer->id");
        $this->command->info("Company: $company->id");
        $this->command->info("Customers: " . $customers->pluck('id')->join(', '));
    }
}