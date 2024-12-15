<?php
// app/Http/Middleware/VerifyCsrfToken.php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware; 
use Illuminate\Support\Facades\Log;

class VerifyCsrfToken extends Middleware
{
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

    public function handle($request, \Closure $next)
    {
        Log::info('VerifyCsrfToken Middleware: Incoming Request', ['url' => $request->fullUrl()]);
        return parent::handle($request, $next);
    }
}
