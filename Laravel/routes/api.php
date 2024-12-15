<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\ProviderController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/service/{id}', [ServiceController::class, 'show']);

Route::get('/appointments', [AppointmentController::class, 'index']); 
Route::get('/appointment/{id}', [AppointmentController::class, 'show']);

Route::get('/time-slots', [TimeSlotController::class, 'index']); 
Route::get('/time-slot/{id}', [TimeSlotController::class, 'show']);

Route::get('/providers', [ProviderController::class, 'index']);
Route::get('/provider/{id}', [ProviderController::class, 'show']);


// Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/service', [ServiceController::class, 'store']); 
    Route::put('/service/{id}', [ServiceController::class, 'update']);
    Route::delete('/service/{id}', [ServiceController::class, 'destroy']);


    Route::post('/appointment', [AppointmentController::class, 'store']);
    Route::put('/appointment/{id}', [AppointmentController::class, 'update']); 
    Route::delete('/appointment/{id}', [AppointmentController::class, 'destroy']);

    Route::post('/time-slot', [TimeSlotController::class, 'store']);
    Route::put('/time-slot/{id}', [TimeSlotController::class, 'update']);
    Route::delete('/time-slot/{id}', [TimeSlotController::class, 'destroy']);
// });
