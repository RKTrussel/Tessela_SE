<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Campaign;
use App\Models\CampaignImage;

class CampaignController extends Controller
{
    public function index(Request $r)
    {
        $q = Campaign::query()
            ->when($r->filled('q'), function ($x) use ($r) {
                $term = $r->q;
                $x->where(fn($w) =>
                    $w->where('name', 'like', "%$term%")
                      ->orWhere('description', 'like', "%$term%")
                );
            })
            ->when($r->filled('status'), fn($x) => $x->where('status', $r->status))
            ->with(['images' => fn($i) => $i->orderBy('order')])
            ->withSum(['donations as raised' => function ($q) {
                $q->where('payment_status', 'paid');
            }], 'amount')
            ->latest();

       return $q->get([
        'campaign_id','name','description','status',
        'start_date','end_date','goalAmount','recipient',
        ]);

    }

    // GET /api/campaigns/{campaign}
    public function show(Campaign $campaign)
    {
        $campaign->load([
            'images' => fn($i) => $i->orderBy('order'),
        ])->loadSum(['donations as raised' => function ($q) {
            $q->where('payment_status', 'paid');
        }], 'amount');

        return $campaign;
    }

    // POST /api/campaigns
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required','string','max:255'],
            'goalAmount'  => ['required','numeric','min:1'],
            'description' => ['required','string'],
            'recipient'    => ['required','string','max:255'],
            'start_date'  => ['required','date'],
            'end_date'    => ['required','date','after_or_equal:start_date'],
            'status'      => ['nullable', Rule::in(['active','draft','closed'])],
            'images'      => ['sometimes','array'],
            'images.*'    => ['file','image','max:10240'],
        ]);

        $data['status'] = $data['status'] ?? 'active';

        $campaign = Campaign::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('campaigns', 'public');
                CampaignImage::create([
                    'campaign_id' => $campaign->campaign_id,
                    'image_path'  => $path,
                    'order'       => $i,
                ]);
            }
        }

        return response()->json(
            $campaign->load(['images' => fn($i) => $i->orderBy('order')]),
            201
        );
    }

    // PUT /api/campaigns/{campaign}
    public function update(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'name'        => ['sometimes','string','max:255'],
            'goalAmount'  => ['sometimes','numeric','min:1'],
            'description' => ['sometimes','string'],
            'recipient'   => ['sometimes','string','max:255'],
            'start_date'  => ['sometimes','date'],
            'end_date'    => ['sometimes','date','after_or_equal:start_date'],
            'status'      => ['sometimes', Rule::in(['active','draft','closed'])],
        ]);

        if (array_key_exists('status', $data)) {
            // optional bookkeeping
            $campaign->closed_at = $data['status'] === 'closed' ? now() : null;
        }

        $campaign->fill($data)->save();

        // Return fresh with relations/raised sum if your UI needs it
        $campaign->load(['images' => fn($i) => $i->orderBy('order')])
                 ->loadSum(['donations as raised' => function ($q) {
                     $q->where('payment_status', 'paid');
                 }], 'amount');

        return response()->json($campaign, 200);
    }

    // (optional) If you kept PATCH /campaigns/{campaign}/status in routes
    public function updateStatus(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['active','draft','closed'])],
        ]);

        $campaign->status = $data['status'];
        $campaign->closed_at = $data['status'] === 'closed' ? now() : null;
        $campaign->save();

        return response()->json($campaign->fresh(), 200);
    }

    // (optional) DELETE /api/campaigns/{campaign}
    public function destroy(Campaign $campaign)
    {
        $campaign->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}