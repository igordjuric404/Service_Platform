<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Appointment;

class ReviewSeeder extends Seeder
{
    public function run()
    {
        $customers = User::where('type', 'customer')->get();

        foreach ($customers as $customer) {
            $confirmedAppointments = Appointment::where('customer_id', $customer->id)
                ->where('status', 'confirmed')
                ->whereHas('service', function ($query) {
                    $query->whereNotNull('provider_id');
                })
                ->get();

            foreach ($confirmedAppointments as $index => $appointment) {
                // **Optionally skip the first appointment if desired**
                /*
                if ($index === 0) {
                    continue;
                }
                */

                // Check if the appointment already has a review
                if (!$appointment->review) {
                    // **Create a review using the factory or directly**
                    Review::create([
                        'customer_id' => $customer->id,
                        'provider_id' => $appointment->service->provider_id,
                        'appointment_id' => $appointment->id,
                        'rating' => rand(1, 5),
                        'comment' => fake()->sentence(),
                    ]);
                }
            }
        }
    }
}
