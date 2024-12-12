<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    public function run()
    {
        $customers = User::where('type', 'customer')->get();
        $providers = User::whereIn('type', ['freelancer', 'company'])->get();

        foreach ($customers as $customer) {
            $providers->random(2)->each(function ($provider) use ($customer) {
                Review::create([
                    'customer_id' => $customer->id,
                    'provider_id' => $provider->id,
                    'rating' => rand(1, 5),
                    'comment' => fake()->sentence(),
                ]);
            });
        }
    }
}
