<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['tenant']], function () {
    Route::prefix('key-management')->group(function () {
        Route::get('/', function () {
            return Inertia::render('KeyManagement/KeyManagement');
        });
        
        Route::get('/create', function () {
            return Inertia::render('KeyManagement/Create');
        });
    });
});
