<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['tenant']], function () {
    Route::prefix('data-repository')->group(function () {
        Route::get('/', function () {
            return Inertia::render('DataRepository/DataRepository');
        });

        Route::get('/editor/{id?}', function ($id = null) {
            return Inertia::render('DataRepository/Editor', ['id' => $id]);
        });

        Route::prefix('create-values')->group(function () {
            Route::get('{id}/', function ($id) {
                return Inertia::render('DataRepository/CreateValues',  ['id' => $id]);
            });

            Route::get('/{id}/manual', function ($id) {
                return Inertia::render('DataRepository/Manual', ['id' => $id]);
            });

            Route::get('/{id}/copilot', function ($id) {
                return Inertia::render('DataRepository/Copilot', ['id' => $id]);
            });

            Route::get('/{id}/import', function ($id) {
                return Inertia::render('DataRepository/Import', ['id' => $id]);
            });
        });
    });
});
