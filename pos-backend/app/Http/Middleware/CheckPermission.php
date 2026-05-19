<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next, string $param_permission): Response
    {
        // Retrieve permission from authenticated user's JWT payload
        $permissions = auth('api')->payload()->get('permissions');
        // check if the given permission exits in the user's permission
        $hasPermission = collect($permissions)->contains('name', $param_permission);
        if (!$hasPermission) {
            return response()->json([
                'message' => 'You do not have permission to access this resource.'
            ], 403);
        }
        return $next($request);
    }
}
