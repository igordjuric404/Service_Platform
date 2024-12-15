<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function index()
    {
        return Provider::withCount(['appointments'])
            ->withAvg('reviews', 'rating')
            ->get()
            ->map(function ($provider) {
                $provider->average_rating = $provider->reviews_avg_rating ?? 0;
                $provider->total_appointments = $provider->appointments_count ?? 0;
                return $provider;
            });
    }

    public function show($id)
    {
        $provider = Provider::with(['services', 'reviews.customer'])->findOrFail($id);

        return response()->json($provider);
    }
}
