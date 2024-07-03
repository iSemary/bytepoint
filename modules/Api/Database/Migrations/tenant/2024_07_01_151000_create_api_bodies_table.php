<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('api_bodies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('api_id');
            $table->unsignedBigInteger('data_type_id');
            $table->string('body_key');
            $table->string('body_value');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_bodies');
    }
};
