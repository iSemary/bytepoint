<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider {
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')->prefix('api/v1.0')->group(base_path('routes/v1.0/api.php'));

            // External API calls
            Route::middleware('api')->prefix(config('settings.tenant_api_prefix'))->group(base_path('routes/v1.0/external.php'));

            Route::middleware('api')->prefix('api/v1.0')->group(base_path('routes/v1.0/modules.php'));

            Route::middleware('web')->group(base_path('routes/web.php'));

            Route::middleware('web')->group(base_path('routes/modules.php'));
        });
    }
}
