<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_images', function (Blueprint $table) {
            $table->id('blog_images_id');
            $table->unsignedBigInteger('blog_id'); // <- must match the type of blogs.blog_id
            $table->string('path');
            $table->integer('order')->default(1);
            $table->timestamps();

            $table->foreign('blog_id')->references('blog_id')->on('blogs')->onDelete('cascade');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('blog_images');
    }
};