<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['tenant']], function () {
    Route::get('/cloud-services', function () {
        return Inertia::render('CloudService/CloudService');
    });


    Route::get('/cloud-services/{slug}', function ($slug) {
        return Inertia::render('CloudService/CloudServiceBuilder', ['slug' => $slug]);
    });
});