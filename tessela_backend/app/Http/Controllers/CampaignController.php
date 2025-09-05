<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Campaign;
use App\Models\CampaignImage;

class CampaignController extends Controller
{
    // Get all campaigns with images
    public function index()
    {
        return Campaign::with('images')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => ['required','string','max:255'],
            'goalAmount'   => ['required','numeric','min:1'],
            'description'  => ['required','string'],
            'start_date'   => ['required','date'],
            'end_date'     => ['required','date','after_or_equal:start_date'],
            'status'       => ['nullable', Rule::in(['active','closed'])],

            // multiple images
            'images.*'     => ['file','image','max:10240'],
        ]);

        // default status
        $data['status'] = $data['status'] ?? 'active';

        $campaign = Campaign::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('campaigns', 'public'); // storage/app/public/campaigns
                CampaignImage::create([
                    'campaign_id' => $campaign->campaign_id,
                    'image_path'  => $path,
                    'order'       => $i, // ✅ keep track of order like your products
                ]);
            }
        }

        return response()->json($campaign->load('images'), 201);
    }
}