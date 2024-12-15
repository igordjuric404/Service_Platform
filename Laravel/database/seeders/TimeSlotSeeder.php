<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Service;
use App\Models\TimeSlot;

class TimeSlotSeeder extends Seeder
{
    public function run()
    {
        $services = Service::all();
        $freelancer = User::where('type', 'freelancer')->first();
        $company = User::where('type', 'company')->first();

        for ($i = 0; $i < 30; $i++) {
            $service = $services->random();

            TimeSlot::factory()->create([
                'provider_id' => $service->provider_id,
                'service_id' => $service->id,
            ]);
        }
    }
}
