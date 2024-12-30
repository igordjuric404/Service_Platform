<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run()
    {
        $providers = User::whereIn('type', ['freelancer', 'company'])->get();

        foreach ($providers as $provider) {
            Service::factory()->count(3)->create([
                'provider_id' => $provider->id
            ]);
        }
    }
}
