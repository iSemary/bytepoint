<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['tenant']], function () {
    Route::get('/cloud-services', function () {
        return Inertia::render('CloudService/CloudService');
    });
});