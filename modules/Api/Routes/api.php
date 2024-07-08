<?php

use Illuminate\Support\Facades\Route;
use Modules\Api\Http\Controllers\ApiController;

Route::group(['middleware' => ['tenant', 'tenancy.enforce', 'auth:api']], function () {
    Route::get('apis/prepare', [ApiController::class, "prepare"]);
    Route::put('apis/{id}/restore', [ApiController::class, 'restore']);
    Route::get('apis/{id}/sample', [ApiController::class, 'sample']);
    Route::post('apis/run/{id}', [ApiController::class, "run"]);
    Route::post('apis/export/{id}', [ApiController::class, "export"]);
    Route::apiResource('apis', ApiController::class);
});
