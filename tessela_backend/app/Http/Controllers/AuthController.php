<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Log;

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

        $account = Account::login($validated['email'], $validated['password']);

        if ($account) {
            if ($account instanceof Admin) {
                return response()->json([
                    'message' => 'Login successful',
                    'user' => $account,
                    'role' => 'admin',
                ], 200);
            } elseif ($account instanceof User) {
                return response()->json([
                    'message' => 'Login successful',
                    'user' => $account,
                    'role' => 'user',
                ], 200);
            }
        }
        return response()->json(['error' => 'Login failed'], 401);

    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        Account::logout();

        return response()->json([
            'message' => 'Logout successful',
            'status' => 'success',
        ], 200);
    }
}
