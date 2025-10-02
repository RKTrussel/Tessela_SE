<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id('blog_id');
            $table->unsignedBigInteger('user_id');
            $table->string('title');
            $table->string('author');
            $table->text('content');
            $table->date('date');
            $table->enum('status', ['draft', 'published', 'rejected'])->default('draft');
            $table->timestamps();

            $table->foreign('user_id')
                  ->references('account_id')->on('accounts')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
