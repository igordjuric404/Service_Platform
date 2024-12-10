<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('time_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('service_id')->nullable()->constrained('services')->onDelete('set null');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->boolean('booked')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('time_slots');
    }
};