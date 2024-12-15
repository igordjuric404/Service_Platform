<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class LogAllRequests
{
    public function handle($request, Closure $next)
    {
        Log::info('Incoming Request', [
            'method' => $request->method(),
            'url' => $request->url(),
            'headers' => $request->headers->all(),
            'cookies' => $request->cookies->all(),
        ]);

        return $next($request);
    }
}
