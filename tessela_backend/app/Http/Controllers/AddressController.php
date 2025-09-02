<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $account = $request->user(); 
        return response()->json($account->addresses);
    }

    public function store(Request $request)
    {
        $account = $request->user();

        // Log raw request input
        Log::info('Incoming address request:', $request->all());

        $data = $request->validate([
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'address_line1' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'postal_code' => 'required|string',
            'is_default' => 'boolean',
        ]);

        // Add enforced values
        $data['name'] = $account->name;
        if (!isset($data['email'])) {
            $data['email'] = $account->email;
        }

        // Log after validation + autofill
        Log::info('Processed address data:', $data);

        if ($data['is_default'] ?? false) {
            $account->addresses()->update(['is_default' => false]);
        }

        $address = $account->addresses()->create($data);

        // Log final saved model
        Log::info('Saved address:', $address->toArray());

        return response()->json($address, 201);
    }

    public function update(Request $request, Address $address)
    {
        $account = $request->user();
        if ($address->account_id !== $account->account_id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'email' => 'nullable|email',
            'address_line1' => 'sometimes|string',
            'city' => 'sometimes|string',
            'province' => 'sometimes|string',
            'postal_code' => 'sometimes|string',
            'is_default' => 'boolean',
        ]);

        if ($data['is_default'] ?? false) {
            $account->addresses()->update(['is_default' => false]);
        }

        $address->update($data);

        return response()->json($address);
    }

    public function destroy(Request $request, Address $address)
    {
        $account = $request->user();
        if ($address->account_id !== $account->account_id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $address->delete();

        return response()->json(['message' => 'Address deleted']);
    }
}