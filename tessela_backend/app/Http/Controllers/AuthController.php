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
            'name' => 'required|string',
            'email' => 'required|email|unique:accounts',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user',
        ]);

        if (Account::register(
            $validated['name'],
            $validated['email'],
            $validated['password'],
            $validated['role']
        )) {
            return response()->json(['message' => 'Account created successfully']);
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

       if($account) {
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

       return response()->json(['error' => 'Invalid credentials'], 401);
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
