<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\ReviewController;
use Laravel\Passport\Http\Controllers\AccessTokenController;
use Laravel\Passport\Http\Controllers\PersonalAccessTokenController;
use App\Models\Customer;

Route::post('/oauth/token', [AccessTokenController::class, 'issueToken']);
Route::post('/oauth/personal-access-tokens', [PersonalAccessTokenController::class, 'store']);
Route::delete('/oauth/personal-access-tokens/{tokenId}', [PersonalAccessTokenController::class, 'destroy']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/service/{id}', [ServiceController::class, 'show']);
Route::get('/services/export/csv', [ServiceController::class, 'exportCsv'])->name('services.export.csv');

Route::get('/appointments', [AppointmentController::class, 'index']); 
Route::get('/appointment/{id}', [AppointmentController::class, 'show']);

Route::get('/time-slots', [TimeSlotController::class, 'index']); 
Route::get('/time-slot/{id}', [TimeSlotController::class, 'show']);

Route::get('/providers', [ProviderController::class, 'index']);
Route::get('/provider/{id}', [ProviderController::class, 'show']);
Route::get('/providers/export/csv', [ProviderController::class, 'exportCsv'])->name('providers.export.csv');


Route::middleware('auth:api')->group(function () {
  Route::get('/user', function (Request $request) {
    $user = $request->user();

    if ($user->type === 'customer') {
            $customer = Customer::with(['appointments.service', 'appointments.timeSlot', 'appointments.review'])->find($user->id);
            $user->appointments = $customer ? $customer->appointments : [];
        } else {
            $user->appointments = [];
        }

        return response()->json($user);
    });


  Route::get('/user/{id}', function ($id) {
      $user = \App\Models\User::findOrFail($id);

      if ($user->type === 'customer') {
          $customer = \App\Models\Customer::with(['appointments.service', 'appointments.timeSlot'])->find($id);
          $user->appointments = $customer ? $customer->appointments : [];
      } else {
          $user->appointments = [];
      }

      return response()->json($user);
  });

  Route::post('/service', [ServiceController::class, 'store']);
  Route::put('/service/{id}', [ServiceController::class, 'update']);
  Route::delete('/service/{id}', [ServiceController::class, 'destroy']);
  Route::get('/my-services', [ServiceController::class, 'getProviderServices']);

  Route::post('/appointment', [AppointmentController::class, 'store']);
  Route::put('/appointment/{id}', [AppointmentController::class, 'update']);
  Route::delete('/appointment/{id}', [AppointmentController::class, 'destroy']);

  Route::post('/availability/generate', [AvailabilityController::class, 'generate']);

  Route::post('/time-slot', [TimeSlotController::class, 'store']);
  Route::put('/time-slot/{id}', [TimeSlotController::class, 'update']);
  Route::delete('/time-slot/{id}', [TimeSlotController::class, 'destroy']);

  Route::post('/reviews', [ReviewController::class, 'store']);

  Route::post('/logout', [AuthController::class, 'logout']);
});
