<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Campaign;
use App\Models\CampaignImage;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('data/campaigns.json'));
        $campaigns = json_decode($json, true);

        foreach ($campaigns as $item) {
            $campaign = Campaign::create([
                'name' => $item['name'],
                'goalAmount' => $item['goalAmount'],
                'description' => $item['description'],
                'recipient' => $item['recipient'],
                'start_date' => $item['start_date'],
                'end_date' => $item['end_date'],
                'status' => $item['status'] ?? 'active',
            ]);

            if (isset($item['images']) && is_array($item['images'])) {
                foreach ($item['images'] as $i => $path) {
                    CampaignImage::create([
                        'campaign_id' => $campaign->campaign_id,
                        'image_path' => $path,
                        'order' => $i,
                    ]);
                }
            }
        }
    }
}