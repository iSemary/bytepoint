<?php

use App\Http\Controllers\AppController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('tenant')->group(function () {
    Route::get('/test', [AppController::class, 'index']);
});


Route::get('/login', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
});

Route::get('/apis', function () {
    return Inertia::render('Api/Api');
});

Route::get('/apis/create', function () {
    return Inertia::render('Api/Create');
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

Route::get('/logs', function () {
    return Inertia::render('Logs/Logs');
});


Route::get('/templates', function () {
    return Inertia::render('Templates/Templates');
});


Route::get('/settings', function () {
    return Inertia::render('Settings/Settings');
});

Route::prefix('data-repository')->group(function () {
    Route::get('/', function () {
        return Inertia::render('DataRepository/DataRepository');
    });
    Route::prefix('create')->group(function () {
        Route::get('/', function () {
            return Inertia::render('DataRepository/Create');
        });

        Route::get('/manual', function () {
            return Inertia::render('DataRepository/Manual');
        });

        Route::get('/copilot', function () {
            return Inertia::render('DataRepository/Copilot');
        });

        Route::get('/import', function () {
            return Inertia::render('DataRepository/Import');
        });
    });
});
