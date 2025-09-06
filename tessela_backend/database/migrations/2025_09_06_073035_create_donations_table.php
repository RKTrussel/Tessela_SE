<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->bigIncrements('donation_id');

            // campaigns FK (must match campaigns PK type)
            $table->unsignedBigInteger('campaign_id');
            $table->foreign('campaign_id')
                ->references('campaign_id')->on('campaigns')
                ->cascadeOnDelete();

            // accounts FK (we’ll call it user_id in this table, but reference account_id)
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')
                ->references('account_id')->on('accounts')
                ->nullOnDelete();

            $table->decimal('amount', 12, 2);
            $table->enum('payment_status', ['pending','paid','failed','refunded'])
                  ->default('pending');
            $table->string('payment_ref')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();

            $table->index(['campaign_id','payment_status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};