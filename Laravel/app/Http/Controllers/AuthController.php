<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        Log::info('Register Method: Incoming Request', ['data' => $request->all()]);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        Log::info('Register Method: Validated Data', ['validated' => $validatedData]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        Log::info('Register Method: User Created', ['user_id' => $user->id]);

        return response()->json(['message' => 'Registration successful!'], 201);
    }

    public function login(Request $request)
    {
        Log::info('Login Method: Incoming Request', ['data' => $request->only(['email'])]);
    
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        Log::info('Login Method: Validated Credentials', ['credentials' => ['email' => $credentials['email']]]);
    
        if (!Auth::attempt($credentials)) {
            Log::warning('Login Method: Authentication Failed', ['email' => $credentials['email']]);
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        Log::info('Login Method: Authentication Successful', ['user_id' => Auth::id()]);
    
        $user = Auth::user();
        $token = $user->createToken('auth_token')->accessToken;
    
        Log::info('Login Method: Token Created', ['user_id' => $user->id]);
    
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    
}
