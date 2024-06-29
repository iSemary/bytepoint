<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::group(['middleware' => ['tenant']], function () {
    Route::get('/apis', function () {
        return Inertia::render('Api/Api');
    });

    Route::get('/apis/create', function () {
        return Inertia::render('Api/Create');
    });
});
