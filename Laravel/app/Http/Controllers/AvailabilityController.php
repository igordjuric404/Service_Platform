<?php

namespace App\Http\Controllers;

use App\Models\TimeSlot;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AvailabilityController extends Controller
{
    public function generate(Request $request)
    {
        $validatedData = $request->validate([
            'provider_id' => 'required|exists:users,id',
            'availability' => 'required|array|min:1',
            'availability.*.day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'availability.*.start_time' => 'required|date_format:H:i',
            'availability.*.duration' => 'required|integer|min:15',
            'availability.*.service_id' => 'required|exists:services,id'
        ]);

        $providerId = $validatedData['provider_id'];
        $availability = $validatedData['availability'];

        // Verify that the provider is indeed a freelancer or company, if you have a 'type' column:
        $provider = User::findOrFail($providerId);
        if (!in_array($provider->type, ['freelancer', 'company'])) {
            return response()->json(['message' => 'User is not a provider.'], 403);
        }

        // We'll generate time slots for the next 30 days
        $today = Carbon::today();
        $endDate = Carbon::today()->addDays(30);

        // Map weekdays to Carbon constants
        $dayMap = [
            'Monday' => Carbon::MONDAY,
            'Tuesday' => Carbon::TUESDAY,
            'Wednesday' => Carbon::WEDNESDAY,
            'Thursday' => Carbon::THURSDAY,
            'Friday' => Carbon::FRIDAY,
            'Saturday' => Carbon::SATURDAY,
            'Sunday' => Carbon::SUNDAY,
        ];

        // We'll store created slots for response (optional)
        $createdSlots = [];

        DB::transaction(function () use ($availability, $dayMap, $today, $endDate, $providerId, &$createdSlots) {
            // For each availability pattern:
            foreach ($availability as $pattern) {
                $dayName = $pattern['day'];
                $startTime = $pattern['start_time']; // "HH:mm"
                $duration = (int) $pattern['duration']; // Ensure duration is integer
                $serviceId = $pattern['service_id'];

                // For the next 30 days, find all dates matching this weekday
                $currentDate = $today->copy();
                $targetDayOfWeek = $dayMap[$dayName];

                // Move $currentDate to the first occurrence of $dayName in the future
                // If today is after that weekday, it will move to next week's occurrence
                while ($currentDate->dayOfWeek !== $targetDayOfWeek) {
                    $currentDate->addDay();
                }

                // Now $currentDate is on the correct weekday, iterate until endDate
                while ($currentDate->lte($endDate)) {
                    // Construct a start DateTime for this slot
                    // start_time is something like "10:00"
                    $slotStart = Carbon::parse($currentDate->format('Y-m-d') . ' ' . $startTime);

                    $slotEnd = $slotStart->copy()->addMinutes($duration);

                    // Check if already booked or overlapping if needed, or just create
                    // For simplicity, we assume it's safe to create
                    $newSlot = TimeSlot::create([
                        'provider_id' => $providerId,
                        'service_id' => $serviceId,
                        'start_time' => $slotStart->format('Y-m-d H:i:s'),
                        'end_time' => $slotEnd->format('Y-m-d H:i:s'),
                        'booked' => false,
                    ]);

                    $createdSlots[] = $newSlot;

                    // Move to next week's occurrence of that day
                    $currentDate->addWeek();
                }
            }
        });

        Log::info('Availability schedule created', [
            'provider_id' => $providerId,
            'total_slots' => count($createdSlots)
        ]);

        return response()->json([
            'message' => 'Availability schedule created successfully.',
            'created_slots' => $createdSlots
        ], 201);
    }
}
