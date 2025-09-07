<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Blog;
use App\Models\BlogImage;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $jsonpath = database_path('data\blogs.json');

        $blogs = json_decode(File::get($jsonpath), true);

        foreach($blogs as $blogData) {
            
            $date = Carbon::createFromFormat('m/d/Y', $blogData['date'])->format('Y-m-d');

            $blog = Blog::create([
                'title' => $blogData['title'],
                'author' => $blogData['author'],
                'content' => $blogData['content'],
                'date' => $date,
            ]);

            if(!empty($blogData['images'])) {
                foreach($blogData['images'] as $index => $imgPath) {
                    BlogImage::create([
                        'blog_id' => $blog->blog_id,
                        'path' => $imgPath,
                        'order' => $index + 1,
                    ]);
                }
            }
        }
    }
}
