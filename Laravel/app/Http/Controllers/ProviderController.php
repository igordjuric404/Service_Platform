<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:255',
            'min_rating' => 'nullable|numeric|min:0|max:5',
            'min_appointments' => 'nullable|integer|min:0',
            'sort' => 'nullable|string|in:name-asc,name-desc,rating-asc,rating-desc,appointments-asc,appointments-desc',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $perPage = $request->input('per_page', 9);
        $page = $request->input('page', 1);
        $searchTerm = $request->input('search', '');
        $minRating = $request->input('min_rating', 0);
        $minAppointments = $request->input('min_appointments', 0);
        $sortOption = $request->input('sort', 'name-asc');

        $query = Provider::query()
            ->withCount('appointments')
            ->withAvg('reviews', 'rating');

        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('type', 'like', "%{$searchTerm}%");
            });
        }

        if ($minRating > 0) {
            $query->having('reviews_avg_rating', '>=', $minRating);
        }

        if ($minAppointments > 0) {
            $query->having('appointments_count', '>=', $minAppointments);
        }

        switch ($sortOption) {
            case 'name-asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name-desc':
                $query->orderBy('name', 'desc');
                break;
            case 'rating-asc':
                $query->orderBy('reviews_avg_rating', 'asc');
                break;
            case 'rating-desc':
                $query->orderBy('reviews_avg_rating', 'desc');
                break;
            case 'appointments-asc':
                $query->orderBy('appointments_count', 'asc');
                break;
            case 'appointments-desc':
                $query->orderBy('appointments_count', 'desc');
                break;
            default:
                $query->orderBy('name', 'asc');
                break;
        }

        try {
            $providers = $query->paginate($perPage, ['*'], 'page', $page);
            $transformedData = collect($providers->items())->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'name' => $provider->name,
                    'type' => $provider->type,
                    'email' => $provider->email,
                    'average_rating' => $provider->reviews_avg_rating ? round($provider->reviews_avg_rating, 2) : 'N/A',
                    'total_appointments' => $provider->appointments_count,
                ];
            });

            $response = [
                'data' => $transformedData,
                'current_page' => $providers->currentPage(),
                'last_page' => $providers->lastPage(),
                'per_page' => $providers->perPage(),
                'total' => $providers->total(),
                'next_page_url' => $providers->nextPageUrl(),
                'prev_page_url' => $providers->previousPageUrl(),
            ];

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching providers.'], 500);
        }
    }

    public function show($id)
    {
        try {
            $provider = Provider::with(['services', 'reviews.customer'])
                ->withCount('appointments')
                ->withAvg('reviews', 'rating')
                ->findOrFail($id);

            $data = [
                'id' => $provider->id,
                'name' => $provider->name,
                'type' => $provider->type,
                'email' => $provider->email,
                'average_rating' => $provider->reviews_avg_rating ? round($provider->reviews_avg_rating, 2) : 'N/A',
                'total_appointments' => $provider->appointments_count,
                'services' => $provider->services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'title' => $service->title,
                        'description' => $service->description,
                        'price' => $service->price,
                    ];
                }),
                'reviews' => $provider->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'customer_name' => $review->customer->name,
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                    ];
                }),
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Provider not found.'], 404);
        }
    }
}
