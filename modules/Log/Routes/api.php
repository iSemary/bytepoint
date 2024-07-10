<?php

use Illuminate\Support\Facades\Route;
use Modules\Log\Http\Controllers\Api\LogController;

Route::group([
    'prefix' => 'logs',
    'middleware' => ['tenant', 'tenancy.enforce', 'auth:api', '2fa']
], function () {
    Route::get("/", [LogController::class, "index"]);
    Route::get("/{id}", [LogController::class, "show"]);
});
