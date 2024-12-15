<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware; 
use Illuminate\Support\Facades\Log; // Import Log

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        '/sanctum/csrf-cookie',
    ];
  
     protected function tokensMatch($request)
     {
         $token = $request->header('X-XSRF-TOKEN') ?? $request->input('_token');
         Log::info('Expected Token: ' . $request->session()->token());
         Log::info('Received Token: ' . $token);
         return is_string($request->session()->token()) &&
                hash_equals($request->session()->token(), $token);
     }
     

}
