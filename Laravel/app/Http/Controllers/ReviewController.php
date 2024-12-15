<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Appointment;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Validate input
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|integer|exists:appointments,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointmentId = $request->input('appointment_id');

        // Fetch the appointment with service
        $appointment = Appointment::with('service')->findOrFail($appointmentId);

        // Check if the appointment belongs to the user
        if ($appointment->customer_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        // Check if the appointment is confirmed
        if ($appointment->status !== 'confirmed') {
            return response()->json(['error' => 'Cannot review an appointment that is not confirmed.'], 400);
        }

        // Check if a review already exists for this appointment
        if ($appointment->review) {
            return response()->json(['error' => 'You have already reviewed this appointment.'], 400);
        }

        // Create the review
        $review = Review::create([
            'customer_id' => $user->id,
            'provider_id' => $appointment->service->provider_id, // Access provider_id via service
            'appointment_id' => $appointmentId,
            'rating' => $request->input('rating'),
            'comment' => $request->input('comment'),
        ]);

        return response()->json(['message' => 'Review submitted successfully.', 'review' => $review], 201);
    }
}
