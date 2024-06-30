<?php

use Illuminate\Support\Facades\Route;
use Modules\UserManagement\Http\Controllers\Api\UserManagementController;

Route::group(['middleware' => ['tenant', 'tenancy.enforce', 'auth:api']], function () {
    Route::get('users/prepare', [UserManagementController::class, "prepare"]);
    Route::apiResource('users', UserManagementController::class);
    Route::put('users/{id}/restore', [UserManagementController::class, 'restore']);
});
