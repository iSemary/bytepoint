<?php

use Illuminate\Support\Facades\Route;
use Modules\Template\Http\Controllers\Api\TemplateController;

Route::group(['middleware' => ['tenant', 'tenancy.enforce', 'auth:api', '2fa']], function () {
    Route::get('templates', [TemplateController::class, "index"]);
    Route::post('templates/{id}/store', [TemplateController::class, "store"]);
    Route::get('templates/{slug}', [TemplateController::class, "show"]);
});
