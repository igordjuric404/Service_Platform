<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'provider_id' => User::factory(),
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 50, 2000),
        ];
    }
}
