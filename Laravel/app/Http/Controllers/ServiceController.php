<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Exports\ServicesExport;
use Maatwebsite\Excel\Facades\Excel;

class ServiceController extends Controller
{
    public function index()
    {
        return Service::with('provider')->get();
    }

    public function show($id)
    {
        return Service::with('provider')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'provider_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        $service = Service::create($validatedData);

        return response()->json(['message' => 'Service created', 'service' => $service], 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        $service->update($validatedData);

        return response()->json(['message' => 'Service updated', 'service' => $service]);
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service deleted']);
    }

    public function getProviderServices()
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Fetch services where the logged-in user is the provider
        $services = Service::where('provider_id', $userId)->get();

        return response()->json($services);
    }

    public function exportCsv()
    {
        return Excel::download(new ServicesExport, 'services.csv');
    }
}
