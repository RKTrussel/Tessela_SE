<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\ContactMessageNotification;
use App\Models\Admin;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'message' => 'required|string|max:2000',
        ]);

        // Get admin(s)
        $admins = Admin::where('role', 'admin')->get();

        if ($admins->isEmpty()) {
            return response()->json(['error' => 'No admin found.'], 500);
        }

        // Send the email notification to all admins
        Notification::send($admins, new ContactMessageNotification($data));

        return response()->json(['message' => 'Your message has been sent successfully!']);
    }
}