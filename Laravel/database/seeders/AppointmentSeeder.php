<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\TimeSlot;
use App\Models\User;

class AppointmentSeeder extends Seeder
{
    public function run()
    {
        $customers = User::where('type', 'customer')->get();
        $timeSlots = TimeSlot::all();

        foreach ($customers as $customer) {
            $timeSlots->random(3)->each(function ($timeSlot) use ($customer) {
                Appointment::create([
                    'service_id' => $timeSlot->service_id,
                    'customer_id' => $customer->id,
                    'time_slot_id' => $timeSlot->id,
                    'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled']),
                ]);
            });
        }
    }
}
