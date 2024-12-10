<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
      Schema::table('users', function (Blueprint $table) {
          $table->enum('type', ['customer', 'freelancer', 'company'])->default('customer')->after('password');
      });
  }

  public function down()
  {
      Schema::table('users', function (Blueprint $table) {
          // Drop the 'type' column if it exists
          if (Schema::hasColumn('users', 'type')) {
              $table->dropColumn('type');
          }
      });
  }
};
