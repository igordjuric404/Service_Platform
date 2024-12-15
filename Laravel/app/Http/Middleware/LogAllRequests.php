<?php
// app/Http/Middleware/LogAllRequests.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogAllRequests
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('Incoming Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
            'cookies' => $request->cookies->all(),
            'body' => $request->all(),
        ]);

        return $next($request);
    }
}
