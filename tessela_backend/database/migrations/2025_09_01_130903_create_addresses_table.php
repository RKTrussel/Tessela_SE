<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id('address_id');
            $table->unsignedBigInteger('account_id');
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('address_line1');
            $table->string('city');
            $table->string('province');
            $table->string('postal_code');
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');
        });
    }

    public function down() {
        Schema::dropIfExists('addresses');
    }
};