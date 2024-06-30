<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->integer('customer_id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('username', 64)->nullable();
            $table->integer('country_id')->nullable();
            $table->unsignedInteger('language_id')->default(1);
            $table->tinyInteger('theme_mode')->default(1)->comment('1-> Light | 2-> Dark | 3-> System');
            $table->tinyInteger('factor_authenticate')->default(0);
            $table->string('google2fa_secret')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamp('last_password_at')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('users');
    }
};
