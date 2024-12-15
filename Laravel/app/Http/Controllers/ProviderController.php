<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function index()
    {
        $providers = Provider::all();

        return response()->json($providers);
    }

    public function show($id)
    {
        $provider = Provider::with(['services', 'reviews.customer'])->findOrFail($id);

        return response()->json($provider);
    }
}
