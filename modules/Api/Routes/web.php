<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::group(['middleware' => ['tenant']], function () {
    Route::get('/apis', function () {
        return Inertia::render('Api/Api');
    });

    Route::get('/apis/editor/{id?}', function ($id = null) {
        return Inertia::render('Api/Editor', ['id' => $id]);
    });

    Route::get('/apis/copilot', function () {
        return Inertia::render('Api/Copilot');
    });
    
    Route::get('/apis/create/', function () {
        return Inertia::render('Api/Create');
    });

});
