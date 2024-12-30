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
        $providers = User::whereIn('type', ['freelancer', 'company'])->get();

        // **Define the number of time slots per service**
        $timeSlotsPerService = 5; // Adjust based on needs

        foreach ($services as $service) {
            for ($i = 0; $i < $timeSlotsPerService; $i++) {
                TimeSlot::factory()->create([
                    'provider_id' => $service->provider_id,
                    'service_id' => $service->id,
                ]);
            }
        }
    }
}
