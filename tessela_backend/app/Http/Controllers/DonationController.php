<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\App;

class DonationController extends Controller
{
    // GET /api/campaigns/{campaign}/donations
    public function index(Campaign $campaign)
    {
        $campaign->loadSum(['donations as raised' => function ($q) {
            $q->where('payment_status', 'paid');
        }], 'amount');

        return response()->json([
            'campaign'  => $campaign,
            'donations' => $campaign->donations()
                ->where('payment_status','paid')
                ->latest()->take(50)->get(),
            'progress'  => [
                'raised' => (float)($campaign->raised ?? 0),
                'goal'   => (float)$campaign->goalAmount,
            ],
        ]);
    }

    // POST /api/campaigns/{campaign}/donations
    public function store(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'amount'     => ['required','numeric','min:1'],
            'message'    => ['nullable','string','max:1000'],
            'force_fail' => ['sometimes','boolean'],
        ]);

        // ensure campaign is accepting donations
        $now = now();
        if (
            $campaign->status !== 'active' ||
            $now->lt($campaign->start_date) ||
            $now->gt($campaign->end_date)
        ) {
            return response()->json(['error' => 'Campaign not accepting donations.'], 422);
        }

        // get the authenticated account id (if any)
        $auth = $request->user(); // should be Account model
        $accountId = $auth?->account_id ?? $auth?->id; // support either key

        return DB::transaction(function () use ($request, $campaign, $data, $accountId) {
            $donation = Donation::create([
                'campaign_id'    => $campaign->campaign_id,
                'user_id'        => $accountId, // FK → accounts.account_id
                'amount'         => $data['amount'],
                'message'        => $data['message'] ?? null,
                'payment_status' => 'pending',
            ]);

            if (config('payments.mode', 'mock') === 'mock') {
                abort_unless(App::environment(['local','testing']), 403, 'Mock payments only in dev.');

                $donation->update([
                    'payment_status' => $request->boolean('force_fail') ? 'failed' : 'paid',
                    'payment_ref'    => $donation->payment_ref ?: 'SIM-' . strtoupper(str()->random(10)),
                ]);

                return response()->json($donation->fresh(), 201);
            }

            // TODO: create real payment intent
            return response()->json([
                'donation_id'    => $donation->donation_id,
                'payment_status' => 'pending',
            ], 201);
        });
    }
}