<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reviews', function (Blueprint $table) {
            $table->bigIncrements('review_id');        // PK
            $table->unsignedBigInteger('product_id');  // FK -> products.product_id
            $table->unsignedBigInteger('user_id');     // FK -> accounts.account_id (reviewer)

            $table->unsignedTinyInteger('rating');     // 1–5
            $table->text('comment');
            $table->timestamps();

            $table->foreign('product_id')
                  ->references('product_id')->on('products')
                  ->cascadeOnDelete();

            $table->foreign('user_id')
                  ->references('account_id')->on('accounts')
                  ->cascadeOnDelete();

            $table->index(['product_id', 'created_at']);
            $table->unique(['product_id', 'user_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('reviews');
    }
};
