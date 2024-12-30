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
            'customer_id' => function () {
                return User::factory()->state(['type' => 'customer'])->create()->id;
            },

            'provider_id' => function () {
                return User::factory()->state(['type' => 'freelancer'])->create()->id;
            },

            'appointment_id' => function () {
                return Appointment::factory()->create()->id;
            },
            'rating' => $this->weightedRandomRating(),
            'comment' => $this->faker->sentence(),
        ];
    }

    /**
     * Generate a weighted random rating.
     *
     * @return int
     */
    private function weightedRandomRating()
    {
        // Define the weights for each rating (higher weights for 4 and 5)
        $weights = [
            1 => 3,   // 3% chance
            2 => 5,   // 5% chance
            3 => 7,   // 7% chance
            4 => 25,  // 25% chance
            5 => 60,  // 60% chance
        ];

        // Create an array where each rating appears as many times as its weight
        $ratingPool = [];
        foreach ($weights as $rating => $weight) {
            $ratingPool = array_merge($ratingPool, array_fill(0, $weight, $rating));
        }

        // Randomly pick one rating from the weighted pool
        return $ratingPool[array_rand($ratingPool)];
    }
}
