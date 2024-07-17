<?php

use Illuminate\Support\Facades\Route;
use Modules\GPT\Http\Controllers\GPTController;

Route::group([
    'prefix' => 'gpt',
    'middleware' => ['tenant', 'tenancy.enforce', 'auth:api', '2fa']
], function () {
    Route::post("/generate", [GPTController::class, "generate"]);
});
