<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Account;

class TokenAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */

    public function handle(Request $request, Closure $next)
    {
        // First try Bearer token
        $token = $request->bearerToken();

        // If not found, try cookie
        if (!$token) {
            $token = $request->cookie('auth_token');
        }

        if (!$token) {
            return response()->json(['error' => 'Unauthorized: No token provided'], 401);
        }

        $row = DB::table('account_tokens')->where('token', $token)->first();

        if (!$row) {
            return response()->json(['error' => 'Unauthorized: Invalid token'], 401);
        }

        $user = Account::withoutGlobalScopes()->where('account_id', $row->account_id)->first();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized: User not found'], 401);
        }

        $request->merge(['auth_user' => $user]);
        $request->setUserResolver(fn() => $user);

        return $next($request);

    }
}
