<?php


use Illuminate\Support\Facades\Route;
use Modules\Api\Http\Controllers\ApiExternalController;

// External API calls
Route::group(['middleware' => ['tenant', 'tenancy.enforce']], function () {
    Route::any("{path}/{id?}", [ApiExternalController::class, "handler"]);
});
