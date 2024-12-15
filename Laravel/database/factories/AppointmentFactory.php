<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\TimeSlot;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),
            'customer_id' => User::factory(), 
            'time_slot_id' => null,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled']),
        ];
    }
}
