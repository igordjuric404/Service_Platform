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
        // Get all customers with type 'customer'
        $customers = User::where('type', 'customer')->get();

        foreach ($customers as $customer) {
            // Fetch confirmed appointments for the customer that have associated providers
            $confirmedAppointments = Appointment::where('customer_id', $customer->id)
                ->where('status', 'confirmed')
                ->whereHas('service', function ($query) {
                    $query->whereNotNull('provider_id');
                })
                ->get();

            foreach ($confirmedAppointments as $index => $appointment) {
                // Skip if the appointment already has a review
                if (!$appointment->review) {
                    // Use the factory to create a review
                    Review::factory()->create([
                        'customer_id' => $customer->id,
                        'provider_id' => $appointment->service->provider_id,
                        'appointment_id' => $appointment->id,
                    ]);
                }
            }
        }
    }
}
