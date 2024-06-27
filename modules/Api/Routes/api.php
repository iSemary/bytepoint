<?php

use Illuminate\Support\Facades\Route;
use Modules\Api\Http\Controllers\ApiController;

Route::group(['middleware' => ['tenant', 'tenancy.enforce', 'auth:api']], function () {
    Route::apiResource('apis', ApiController::class);
    Route::put('apis/{id}/restore', [ApiController::class, 'restore']);
});
