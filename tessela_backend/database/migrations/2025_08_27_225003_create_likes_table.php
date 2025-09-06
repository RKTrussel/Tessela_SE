<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id('like_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('blog_id');
            $table->timestamp('date')->useCurrent();
            $table->timestamps();

            // Foreign key
            $table->foreign('user_id')->references('account_id')->on('accounts')->onDelete('cascade');
            $table->foreign('blog_id')->references('blog_id')->on('blogs')->onDelete('cascade');

            $table->unique(['user_id', 'blog_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('likes');
    }
};
