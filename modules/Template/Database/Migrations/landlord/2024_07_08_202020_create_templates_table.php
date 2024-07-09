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
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string("title", 255);
            $table->string("slug", 255);
            $table->string("description", 1024);
            $table->string("icon", 1024);
            $table->enum('type', ['fetch_paginated_data', 'contact_us', 'newsletter', 'ip_to_location', 'ocr']);
            $table->boolean('is_cloud');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
