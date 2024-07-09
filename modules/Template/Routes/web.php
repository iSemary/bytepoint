<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['tenant']], function () {
    Route::get('/templates', function () {
        return Inertia::render('Templates/Templates');
    });

    Route::get('/templates/{slug}', function ($slug) {
        return Inertia::render('Templates/TemplateBuilder', ['slug' => $slug]);
    });
});
