<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartsTable extends Migration
{
    public function up()
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id('cart_id');
            $table->unsignedBigInteger('account_id'); 
            $table->decimal('total_price', 10, 2)->default(0);
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('carts');
    }
}