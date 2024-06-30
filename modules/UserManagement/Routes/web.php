<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['middleware' => ['tenant']], function () {
    Route::get("/user-management", function () {
        return Inertia::render('UserManagement/UserManagement');
    });
    Route::get("/user-management/editor/{id?}", function ($id = null) {
        return Inertia::render('UserManagement/Editor',  ['id' => $id]);
    });
});
