<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['tenant']], function () {
    Route::get('/logs', function () {
        return Inertia::render('Logs/Logs');
    });
});
