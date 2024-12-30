<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\TimeSlot;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AppointmentSeeder extends Seeder
{
    public function run()
    {
        // Retrieve all customers
        $customers = User::where('type', 'customer')->get();

        // Retrieve all available (not booked) time slots
        $availableTimeSlots = TimeSlot::where('booked', false)->get();

        // Shuffle the available time slots to ensure randomness
        $availableTimeSlots = $availableTimeSlots->shuffle();

        // **Define the number of appointments per customer**
        $appointmentsPerCustomer = 5; // Increased from 3 to 5

        foreach ($customers as $customer) {
            for ($i = 0; $i < $appointmentsPerCustomer; $i++) {
                // Check if there are enough available time slots
                if ($availableTimeSlots->isEmpty()) {
                    $this->command->info('No more available time slots to assign.');
                    return;
                }

                // Get the next available time slot
                $timeSlot = $availableTimeSlots->pop();

                // Create the appointment within a transaction
                DB::transaction(function () use ($customer, $timeSlot) {
                    // Create the appointment
                    Appointment::create([
                        'service_id' => $timeSlot->service_id,
                        'customer_id' => $customer->id,
                        'time_slot_id' => $timeSlot->id,
                        // **Ensure a higher probability for 'confirmed' status**
                        'status' => fake()->randomElement(['pending', 'confirmed', 'confirmed', 'cancelled']),
                    ]);

                    // Mark the time slot as booked
                    $timeSlot->update(['booked' => true]);
                });
            }
        }
    }
}
