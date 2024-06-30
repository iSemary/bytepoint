<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
});

Route::group(['middleware' => ['tenant']], function () {
    Route::get("/2fa/generate", function () {
        return Inertia::render('Auth/2FA/FactorAuthenticate');
    });
    
    Route::get("/2fa/validate", function () {
        return Inertia::render('Auth/2FA/Validate');
    });

    Route::get('/settings', function () {
        return Inertia::render('Settings/Settings');
    });
});
