<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        Log::info('Incoming request data: ', $request->all());
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:accounts',
            'password' => 'required|string|min:6',
            'birthday' => 'nullable|date',
            'gender' => 'nullable|in:Male,Female',
        ]);

        if (Account::register(
            $validated['name'],
            $validated['email'],
            $validated['password'],
            $validated['birthday'],
            $validated['gender'],
            $validated['role'] = 'user',
        )) {
            return response()->json(['message' => 'Account created successfully'], 201);
        }

        return response()->json(['error' => 'Registration failed'], 500);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $result = Account::login($validated['email'], $validated['password']);

        if ($result) {
            $user  = $result['user'];
            $token = $result['token'];

            return response()->json([
                'message' => 'Login successful',
                'user'    => $user,
                'role'    => $user->role,
                'token'   => $token,
            ], 200);
        }

        return response()->json(['error' => 'Login failed'], 401);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken() ?? $request->cookie('auth_token');

        if ($token) {
            DB::table('account_tokens')->where('token', $token)->delete();
        }

        return response()->json([
            'message' => 'Logout successful',
        ])->cookie('auth_token', '', -1); 
    }
}
