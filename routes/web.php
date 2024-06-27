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

Route::prefix('mock-ups')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Mockup/Mockup');
    });
    Route::prefix('create')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Mockup/Create');
        });

        Route::get('/manual', function () {
            return Inertia::render('Mockup/Manual');
        });

        Route::get('/copilot', function () {
            return Inertia::render('Mockup/Copilot');
        });
    });
});

Route::get('/file-manager', function () {
    return Inertia::render('Explorer/Explorer');
});

Route::get('/templates', function () {
    return Inertia::render('Templates/Templates');
});

Route::get('/settings', function () {
    return Inertia::render('Settings/Settings');
});

