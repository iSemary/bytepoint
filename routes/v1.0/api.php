<?php


/**
 * Please note that file doesn't contain all the APIs on the application
 * There's also another APIs exists in each module for ex:
 * modules/auth/routes/api.php
 * modules/mockup/routes/api.php
 */

use App\Http\Controllers\Api\UtilityController;
use Illuminate\Support\Facades\Route;

Route::get('categories', [UtilityController::class, 'getCategories']);
Route::get('countries', [UtilityController::class, 'getCountries']);
