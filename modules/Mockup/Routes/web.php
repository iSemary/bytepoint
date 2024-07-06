<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['tenant']], function () {
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
});
