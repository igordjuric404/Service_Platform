<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'provider_id')) {
                $table->foreignId('provider_id')->nullable()->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            }
        });
    }

    public function down()
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'provider_id')) {
                $table->dropForeign(['provider_id']);
                $table->dropColumn('provider_id');
            }
        });
    }
};
