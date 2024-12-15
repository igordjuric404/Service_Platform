<?php

namespace Database\Factories;

use App\Models\TimeSlot;
use App\Models\User;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class TimeSlotFactory extends Factory
{
    protected $model = TimeSlot::class;

    public function definition(): array
    {
        $workingHours = range(8, 18);

        $randomDate = $this->faker->dateTimeBetween('now', '+1 month');

        $hour = $this->faker->randomElement($workingHours);

        $start = new \DateTime($randomDate->format('Y-m-d') . ' ' . $hour . ':00:00');

        $end = (clone $start)->modify('+1 hour');

        return [
            'provider_id' => User::factory(), 
            'service_id' => Service::factory(), 
            'start_time' => $start->format('Y-m-d H:i:s'),
            'end_time' => $end->format('Y-m-d H:i:s'),
            'booked' => false,
        ];
    }
}
