<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Modules\Tenant\Helper\TenantHelper;

class EnforceTenancy {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $subdomain = $this->getSubdomain($request);
        TenantHelper::makeCurrent($subdomain);
        Log::info('Current database connection', ['database' => config('database.default')]);

        return $next($request);
    }

    /**
     * Extract subdomain from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    private function getSubdomain($request) {
        $host = $request->getHost();
        $parts = explode('.', $host);

        // Check if we have more than 2 parts (subdomain.domain.tld)
        if (count($parts) > 2) {
            return $parts[0];
        }

        return null;
    }
}
