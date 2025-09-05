<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCampaignImagesTable extends Migration
{
    public function up()
    {
        Schema::create('campaign_images', function (Blueprint $table) {
            $table->bigIncrements('image_id');
            $table->unsignedBigInteger('campaign_id');
            $table->string('image_path');
            $table->integer('order')->default(0); // ✅ ordering column
            $table->timestamps();

            $table->foreign('campaign_id')
                ->references('campaign_id')
                ->on('campaigns')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('campaign_images');
    }
}
