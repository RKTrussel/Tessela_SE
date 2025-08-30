<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('orders_id');
            $table->unsignedBigInteger('cart_id'); 
            $table->unsignedBigInteger('account_id'); 
            $table->decimal('total_amount', 10, 2);
            $table->string('status'); 
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('cart_id')->references('cart_id')->on('carts')->onDelete('cascade');
            $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
}