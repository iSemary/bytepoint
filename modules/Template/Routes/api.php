<?php

use Illuminate\Support\Facades\Route;
use Modules\Template\Http\Controllers\Api\TemplateController;

Route::group(['middleware' => ['tenant', 'tenancy.enforce', 'auth:api']], function () {
    Route::get('templates', [TemplateController::class, "index"]);
    Route::get('templates/{slug}', [TemplateController::class, "show"]);
});
