<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run()
    {
        $freelancer = User::where('type', 'freelancer')->first();
        $company = User::where('type', 'company')->first();

        for ($i = 0; $i < 10; $i++) {
            Service::factory()->create([
                'provider_id' => $i < 5 ? $freelancer->id : $company->id
            ]);
        }
    }
}
