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
            'start_date','end_date','goalAmount',
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
}