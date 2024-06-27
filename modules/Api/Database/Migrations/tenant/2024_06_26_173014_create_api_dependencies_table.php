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
        Schema::create('api_dependencies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('api_id');
            $table->unsignedBigInteger('depended_api_id');
            $table->unsignedBigInteger('depended_response_key_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_dependencies');
    }
};
