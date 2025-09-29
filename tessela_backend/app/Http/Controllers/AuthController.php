<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:accounts',
            'password' => 'required|string|min:6',
            'birthday' => 'nullable|date',
            'gender' => 'nullable|in:Male,Female',
        ]);

        $account = Account::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'birthday' => $validated['birthday'],
            'gender' => $validated['gender'],
            'role' => 'user',
        ]);

        // 🚀 Send verification email
        event(new Registered($account));

        return response()->json([
            'message' => 'Account created successfully. Please check your email to verify.',
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $result = Account::login($validated['email'], $validated['password']);

        // If login failed (wrong email or password)
        if (!$result) {
            return response()->json(['error' => 'Login failed'], 401);
        }

        // If email not verified
        if (! $result['user']->hasVerifiedEmail()) {
            return response()->json(['error' => 'Please verify your email before logging in.'], 403);
        }

        // Success
        $user  = $result['user'];
        $token = $result['token'];

        return response()->json([
            'message' => 'Login successful',
            'user'    => $user,
            'role'    => $user->role,
            'token'   => $token,
        ], 200);
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

    public function me(Request $request)
    {
        $account = $request->user();

        // Return only safe fields
        return response()->json([
            'account_id' => $account->account_id,
            'name'       => $account->name,
            'email'      => $account->email,
            'gender'     => $account->gender,
            'birthday'   => $account->birthday,
            'role'       => $account->role,
        ]);
    }
}
