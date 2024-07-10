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
        // Update Settings
        Route::patch("user/update", [AuthController::class, "updateUserDetails"]);
        // Logout / Logout All Devices
        Route::post("logout", [AuthController::class, "logout"]);
        // Verify Email
        Route::get("verify/email/{token}", [AuthController::class, "verifyEmail"]);
        // Send Email Verification
        Route::post("send/verify/email", [AuthController::class, "sendVerifyEmail"]);
        // Get Login Attempt
        Route::get('attempts', [AuthController::class, "attempts"]);
        // Get Activity Log
        Route::get('activity-logs', [AuthController::class, "activityLogs"]);
        // Generate 2Fa QR Code
        Route::post('2fa/generate', [AuthController::class, "generate2FACode"]);
        // Verify 2Fa QR Code
        Route::post('2fa/verify', [AuthController::class, "verify2FA"]);
        // Validate 2Fa OTP
        Route::post('2fa/validate', [AuthController::class, "validate2FA"]);
        // deactivate account [From settings]
        Route::post('deactivate', [AuthController::class, "deactivate"]);
        // deactivate account [From settings]
        Route::get('2fa-check', [AuthController::class, "check2FA"]);
    });
});
