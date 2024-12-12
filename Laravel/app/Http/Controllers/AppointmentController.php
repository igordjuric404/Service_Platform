<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index()
    {
        return Appointment::with(['service', 'customer', 'timeSlot'])->get();
    }

    public function show($id)
    {
        return Appointment::with(['service', 'customer', 'timeSlot'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'service_id' => 'required|exists:services,id',
            'customer_id' => 'required|exists:users,id',
            'time_slot_id' => 'nullable|exists:time_slots,id',
            'status' => 'required|string|in:pending,confirmed,cancelled',
        ]);

        $appointment = Appointment::create($validatedData);

        return response()->json(['message' => 'Appointment created', 'appointment' => $appointment], 201);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validatedData = $request->validate([
            'status' => 'required|string|in:pending,confirmed,cancelled',
            'time_slot_id' => 'nullable|exists:time_slots,id',
        ]);

        $appointment->update($validatedData);

        return response()->json(['message' => 'Appointment updated', 'appointment' => $appointment]);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted']);
    }
}
