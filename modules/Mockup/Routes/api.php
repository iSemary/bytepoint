<?php

use Illuminate\Support\Facades\Route;
use Modules\Mockup\Http\Controllers\Api\MockupController;

Route::group(['middleware' => ['tenant', 'tenancy.enforce', 'auth:api', '2fa']], function () {
    Route::post('mockups/run', [MockupController::class, "run"]);
    Route::put('mockups/{id}/restore', [MockupController::class, 'restore']);
    Route::apiResource('mockups', MockupController::class);
});
