<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        // Validate incoming data
        $validatedData = $request->validate([
            'service_id' => 'required|exists:services,id',
            'customer_id' => 'required|exists:users,id',
            'time_slot_id' => 'required|exists:time_slots,id|unique:appointments,time_slot_id',
            'status' => 'required|string|in:pending,confirmed,cancelled',
        ]);

        Log::info('Attempting to create appointment', ['data' => $validatedData]);

        // Start a database transaction to ensure atomicity
        return DB::transaction(function () use ($validatedData) {
            // Retrieve and lock the TimeSlot for update to prevent race conditions
            $timeSlot = TimeSlot::where('id', $validatedData['time_slot_id'])
                                ->lockForUpdate()
                                ->firstOrFail();

            Log::info('Fetched TimeSlot for booking', ['time_slot_id' => $timeSlot->id]);

            // Check if the TimeSlot is already booked
            if ($timeSlot->booked) {
                Log::warning('TimeSlot already booked', ['time_slot_id' => $timeSlot->id]);
                return response()->json([
                    'message' => 'Time slot is already booked.',
                ], 409); // 409 Conflict
            }

            // Create the Appointment
            $appointment = Appointment::create($validatedData);
            Log::info('Appointment created successfully', ['appointment_id' => $appointment->id]);

            // Mark the TimeSlot as booked
            $timeSlot->update(['booked' => true]);
            Log::info('TimeSlot marked as booked', ['time_slot_id' => $timeSlot->id]);

            return response()->json([
                'message' => 'Appointment created successfully.',
                'appointment' => $appointment,
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validatedData = $request->validate([
            'status' => 'required|string|in:pending,confirmed,cancelled',
            'time_slot_id' => 'nullable|exists:time_slots,id',
        ]);

        $appointment->update($validatedData);

        return response()->json([
            'message' => 'Appointment updated',
            'appointment' => $appointment
        ]);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        // Optionally, mark the time slot as available again
        if ($appointment->time_slot_id) {
            $timeSlot = TimeSlot::find($appointment->time_slot_id);
            if ($timeSlot) {
                $timeSlot->update(['booked' => false]);
                Log::info('TimeSlot marked as available again', ['time_slot_id' => $timeSlot->id]);
            }
        }

        return response()->json([
            'message' => 'Appointment deleted'
        ]);
    }
}
