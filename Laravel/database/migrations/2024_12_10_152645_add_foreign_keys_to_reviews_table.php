<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'provider_id')) {
                $table->foreign('provider_id')
                      ->references('id')
                      ->on('users')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');
            }
        });
    }

    public function down()
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['provider_id']);
        });
    }
};