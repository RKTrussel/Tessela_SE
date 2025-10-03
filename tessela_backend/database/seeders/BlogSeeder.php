<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;
use App\Models\BlogImage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $jsonpath = database_path('data/blogs.json'); // use forward slash for portability

        if (!File::exists($jsonpath)) {
            $this->command->error("blogs.json not found at {$jsonpath}");
            return;
        }

        $blogs = json_decode(File::get($jsonpath), true);

        // get the seeded user (optional)
        $user = User::where('email', 'tallaferkent775@gmail.com')->first();

        foreach ($blogs as $blogData) {
            $date = Carbon::createFromFormat('m/d/Y', $blogData['date'])->format('Y-m-d');

            $blog = Blog::create([
                'user_id' => $user?->account_id,   // ✅ attach if exists, else null
                'title'   => $blogData['title'],
                'author'  => $blogData['author'],
                'content' => $blogData['content'],
                'date'    => $date,
                'status'  => 'published',
            ]);

            if (!empty($blogData['images'])) {
                foreach ($blogData['images'] as $index => $imgPath) {
                    BlogImage::create([
                        'blog_id' => $blog->blog_id,
                        'path'    => $imgPath,
                        'order'   => $index + 1,
                    ]);
                }
            }
        }

        // $this->command->info("Blogs seeded" . ($user ? " and linked to user: {$user->email}" : " (no user attached)"));
    }
}