<?php

use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\Api\AuthController;

/* User Authentication Routes */

Route::group(['prefix' => 'auth'], function () {
    // Registration Routes
    Route::post("register", [AuthController::class, "register"]);
    Route::post("login", [AuthController::class, "login"]);

    Route::group(['middleware' => ['tenant', 'tenancy.enforce', 'auth:api']], function () {
        // Password Validation Routes
        Route::post("forget-password", [AuthController::class, "forgetPassword"]);
        Route::post("reset-password", [AuthController::class, "resetPassword"]);
        // Check Authentication
        Route::get("check", [AuthController::class, "checkAuthentication"]);
        // Profile Route
        Route::get("user/profile", [AuthController::class, "getUserDetails"]);
        // Get authenticated user details
        Route::get("user", [AuthController::class, "getUser"]);
        // Logout / Logout All Devices
        Route::post("logout", [AuthController::class, "logout"]);
        // Verify Email
        Route::get("verify/email/{token}", [AuthController::class, "verifyEmail"]);
        // Send Email Verification
        Route::post("send/verify/email", [AuthController::class, "sendVerifyEmail"]);
        // Get Login Attempt
        Route::get('attempts', [AuthController::class, "attempts"]);
        // Change password [From settings]
        Route::post('update-password', [AuthController::class, "updatePassword"]);
        // toggle 2 factor authenticate [From settings]
        Route::post('toggle-factor-authenticate', [AuthController::class, "toggleFactorAuthenticate"]);
        // deactivate account [From settings]
        Route::post('deactivate', [AuthController::class, "deactivate"]);
    });
});
