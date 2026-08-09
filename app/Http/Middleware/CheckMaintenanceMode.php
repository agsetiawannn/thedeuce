<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckMaintenanceMode
{
    public function handle(Request $request, Closure $next)
    {
        // Toggle this flag to easily turn maintenance on or off
        // Or check an environment variable like env('APP_MAINTENANCE')
        $isMaintenance = env('APP_MAINTENANCE', false); // Default to false instead of true

        if ($isMaintenance) {
            $allowedEmails = [
                'anandazhou09@gmail.com', 
                'idabagusadhya@gmail.com', 
                'abiseka33@gmail.com', 
                'setiawan18221@gmail.com'
            ];

            $user = Auth::user();
            $isAdmin = $user && in_array(strtolower($user->email), $allowedEmails);

            if (!$isAdmin) {
                // Allow auth routes so admin can log in to bypass maintenance
                if ($request->is('auth/*') || $request->is('login') || $request->is('logout') || $request->is('build/*') || $request->is('img/*')) {
                    return $next($request);
                }
                
                // For all other routes, show maintenance page
                return response()->view('maintenance', [], 503);
            }
        }

        return $next($request);
    }
}
