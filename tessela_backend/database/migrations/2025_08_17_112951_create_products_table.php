<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');               
            $table->text('description')->nullable();

            $table->decimal('price', 12, 2)->default(0);
            $table->unsignedInteger('stock')->default(0);

            // store as string to keep leading zeros
            $table->string('barcode_value')->unique();

            $table->enum('condition', ['New', 'used'])->default('New');

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('products');
    }
};
