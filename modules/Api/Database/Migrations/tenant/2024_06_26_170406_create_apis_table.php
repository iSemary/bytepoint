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
        Schema::create('apis', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->tinyInteger('type');
            $table->tinyInteger('service');
            $table->integer('template_id')->nullable();
            $table->unsignedBigInteger('data_repository_id')->nullable();
            $table->string('end_point');
            $table->tinyInteger('method_id');
            $table->unsignedBigInteger('body_type_id');
            $table->boolean('is_authenticated');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apis');
    }
};
