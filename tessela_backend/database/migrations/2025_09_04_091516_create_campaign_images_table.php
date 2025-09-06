<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaign_images', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('campaign_id');
            $table->foreign('campaign_id')
                  ->references('campaign_id')->on('campaigns')
                  ->cascadeOnDelete();

            $table->string('image_path');
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            $table->index(['campaign_id','order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_images');
    }
};