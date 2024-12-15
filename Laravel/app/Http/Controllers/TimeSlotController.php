<?php

namespace App\Http\Controllers;

use App\Models\TimeSlot;
use Illuminate\Http\Request;

class TimeSlotController extends Controller
{
    public function index()
    {
        return response()->json(TimeSlot::with(['provider', 'service', 'appointment'])->get());
    }

    public function show($id)
    {
        $timeSlot = TimeSlot::with(['provider', 'service', 'appointment'])->findOrFail($id);
        return response()->json($timeSlot);
    }

    public function store(Request $request)
    {
        // Validate incoming data for creating a TimeSlot
        $validatedData = $request->validate([
            'provider_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'end_time' => 'required|date_format:Y-m-d H:i:s|after:start_time',
            'booked' => 'sometimes|boolean', // Optional, defaults to false
        ]);

        // Create the TimeSlot
        $timeSlot = TimeSlot::create($validatedData);

        return response()->json([
            'message' => 'TimeSlot created successfully',
            'time_slot' => $timeSlot
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $timeSlot = TimeSlot::findOrFail($id);

        $validatedData = $request->validate([
            'provider_id' => 'sometimes|exists:users,id',
            'service_id' => 'sometimes|exists:services,id',
            'start_time' => 'sometimes|date_format:Y-m-d H:i:s',
            'end_time' => 'sometimes|date_format:Y-m-d H:i:s|after:start_time',
            'booked' => 'sometimes|boolean',
        ]);

        $timeSlot->update($validatedData);

        return response()->json([
            'message' => 'TimeSlot updated successfully',
            'time_slot' => $timeSlot
        ]);
    }

    public function destroy($id)
    {
        $timeSlot = TimeSlot::findOrFail($id);
        $timeSlot->delete();

        return response()->json([
            'message' => 'TimeSlot deleted successfully'
        ]);
    }
}
