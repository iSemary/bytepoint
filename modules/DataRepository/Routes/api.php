<?php

use Illuminate\Support\Facades\Route;
use Modules\DataRepository\Http\Controllers\DataRepositoryController;


Route::group(['middleware' => ['tenant', 'tenancy.enforce', 'auth:api', '2fa']], function () {
    Route::apiResource('data-repositories', DataRepositoryController::class);
    Route::put('data-repositories/{id}/restore', [DataRepositoryController::class, 'restore']);
    Route::post('data-repositories/{id}/fill', [DataRepositoryController::class, 'fill']);
});
