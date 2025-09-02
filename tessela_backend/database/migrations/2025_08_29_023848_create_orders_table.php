<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');

            // Relations
            $table->unsignedBigInteger('account_id');   // who placed the order
            $table->unsignedBigInteger('cart_id')->nullable(); // optional: reference original cart

            // Status + payment
            $table->string('status')->default('pending'); // pending, paid, shipped, cancelled
            $table->string('payment_method');             // e.g., cod, gcash, card

            // Amounts
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_fee', 10, 2)->default(0);
            $table->decimal('total', 10, 2);

            // Shipping snapshot (frozen copy at checkout)
            $table->string('full_name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->string('address_line1');
            $table->string('city');
            $table->string('province');
            $table->string('postal_code');

            $table->timestamps();

            // Foreign keys
            $table->foreign('account_id')
                ->references('account_id')
                ->on('accounts')
                ->onDelete('cascade');

            $table->foreign('cart_id')
                ->references('cart_id')
                ->on('carts')
                ->onDelete('set null'); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
}