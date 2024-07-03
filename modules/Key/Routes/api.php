<?php

use Illuminate\Support\Facades\Route;
use Modules\Key\Http\Controllers\KeyController;

Route::group(['middleware' => ['tenant', 'tenancy.enforce', 'auth:api']], function () {
    Route::apiResource('keys', KeyController::class);
});
