<?php

namespace Modules\Tenant\Repository;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class TenantRepository {

    public function init($customerUsername) {
        $tenantId = $this->createTenantRecord($customerUsername);
        $this->setupDatabase($customerUsername);
        $this->migrateTenant($tenantId);
        $this->seedTenantDatabase($tenantId);

        // Return tenant details
        return $this->getTenantById($tenantId);
    }

    private function createTenantRecord($customerUsername) {
        $tenantId = DB::table('tenants')->insertGetId([
            'name' => $customerUsername,
            'domain' => $this->generateDomain($customerUsername),
            'database' => $this->generateDatabaseName($customerUsername),
            'updated_at' => now(),
            'created_at' => now(),
        ]);

        return $tenantId;
    }

    private function generateDomain($customerUsername) {
        return $customerUsername . '.' . config('settings.domain');
    }

    private function generateDatabaseName($customerUsername) {
        return config('settings.db_prefix') .  '_' . $customerUsername;
    }

    private function setupDatabase($customerUsername) {
        $dbName = $this->generateDatabaseName($customerUsername);
        $this->createDatabase($dbName);
    }

    private function createDatabase($dbName) {
        DB::statement("CREATE DATABASE IF NOT EXISTS " . $dbName);
    }

    private function migrateTenant($tenantId) {
        $path = 'database/migrations/tenant';
        $database = 'tenant';

        $command = "tenants:artisan 'migrate --path={$path} --database={$database}' --tenant={$tenantId}";
        Artisan::call($command);
    }

    private function seedTenantDatabase($tenantId) {
        $database = 'tenant';

        $command = "tenants:artisan 'migrate --database={$database} --seed' --tenant={$tenantId}";
        Artisan::call($command);
    }

    private function getTenantById($tenantId) {
        return DB::table('tenants')->where('id', $tenantId)->first();
    }
}
