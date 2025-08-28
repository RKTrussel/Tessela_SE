<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Admin;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:accounts',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:user,admin',
        ]);

        if($validated['role'] === "Admin") {
            $success = Admin::register(
                $validated['name'],
                $validated['email'],
                $validated['password'],
                'admin',
            );
        } else {
            $success = User::register(
                $validated['name'],
                $validated['email'],
                $validated['password'],
                'user',
            );
        }

        if($success) {
            return response()->json([
                'message' => 'Registration successful',
                'status' => 'success',
            ], 201);
        }

        return response()->json([
            'message' => 'Registration failed',
            'status' => 'error',
        ], 500);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Account::login($credentials['email'], $credentials['password'])) {
            $user = Account::where('email', $credentials['email'])->first();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'status' => 'success',
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid credentials',
            'status' => 'error',
        ], 401);
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
