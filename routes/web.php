<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


/**
 * Please note that file doesn't contain all the Routes on the application
 * There's also another Routes exists in each module for ex:
 * modules/auth/routes/web.php
 * modules/mockup/routes/web.php
 */

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::group(['middleware' => ['tenant']], function () {
    Route::get('/file-manager', function () {
        return Inertia::render('Explorer/Explorer');
    });
});
