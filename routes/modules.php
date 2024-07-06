<?php

use Illuminate\Support\Facades\Route;

$modules = [
    'Auth',
    'Log',
    'DataRepository',
    'Api',
    'UserManagement',
    'Key',
    'Template',
    'CloudService',
    'Mockup',
];

foreach ($modules as $module) {
    Route::group([], base_path("modules/{$module}/Routes/web.php"));
}
