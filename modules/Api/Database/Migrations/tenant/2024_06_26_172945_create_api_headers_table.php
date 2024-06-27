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
        Schema::create('api_headers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('api_id');
            $table->unsignedBigInteger('data_type_id');
            $table->string('header_key');
            $table->string('header_value');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_headers');
    }
};
