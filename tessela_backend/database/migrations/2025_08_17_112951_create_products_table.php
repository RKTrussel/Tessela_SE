<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('name');
            $table->string('weaving_type');               
            $table->text('description')->nullable();
            $table->double('price', 12, 2)->default(0);   
            $table->integer('stock')->default(0);         
            $table->string('barcode_value')->unique();
            $table->enum('condition', ['New', 'Used'])->default('New');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('products');
    }
};
