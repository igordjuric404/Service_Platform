<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition()
    {
        return [
            'customer_id' => User::factory()->state(['type' => 'customer']),
            'provider_id' => User::factory()->state(['type' => 'provider']),
            'appointment_id' => Appointment::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(),
        ];
    }
}
