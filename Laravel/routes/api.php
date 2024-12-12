<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AppointmentController;

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/service/{id}', [ServiceController::class, 'show']);

Route::get('/appointments', [AppointmentController::class, 'index']); 
Route::get('/appointment/{id}', [AppointmentController::class, 'show']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
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
  });
