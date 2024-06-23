<?php

namespace Modules\Tenant\Helper;

use Spatie\Multitenancy\Models\Tenant;

class TenantHelper {

    public static function format($customerUsername) {
        $formattedCustomerUsername = trim($customerUsername);
        $formattedCustomerUsername = preg_replace('/[^a-zA-Z0-9]/', '', $formattedCustomerUsername);
        $formattedCustomerUsername = strtolower($formattedCustomerUsername);
        $formattedCustomerUsername = str_replace(" ", "", $formattedCustomerUsername);
        return $formattedCustomerUsername;
    }

    public static function makeCurrent($customerUsername) {
        $tenant = Tenant::where('name', $customerUsername)->first();
        $tenant->makeCurrent();

        config(['database.default' => 'tenant']);

        return $tenant;
    }

    public static function generateURL($customerUsername) {
        return config("settings.protocol") . "://" . $customerUsername . "." . config("settings.domain");
    }
}
