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
        $this->createLogMongoDatabase($customerUsername);

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
        $paths = [
            'database/migrations/tenant',
            'modules/*/Database/Migrations'
        ];

        $database = 'tenant';

        foreach ($paths as $path) {
            $command = "tenants:artisan 'migrate --path={$path} --database={$database}' --tenant={$tenantId}";
            Artisan::call($command);
        }
    }

    private function seedTenantDatabase($tenantId) {
        $database = 'tenant';

        $command = "tenants:artisan 'migrate --database={$database} --seed' --tenant={$tenantId}";
        Artisan::call($command);
    }

    private function createLogMongoDatabase($customerUsername) {
        $databaseName = $this->generateDatabaseName($customerUsername);

        $clientOptions = ['authSource' => config('database.connections.logs.options.database')];

        // Check if username is defined in configuration
        if (!empty(config('database.connections.logs.username'))) {
            $clientOptions['username'] = config('database.connections.logs.username');
            $clientOptions['password'] = config('database.connections.logs.password');
        }

        $client = new \MongoDB\Client(
            "mongodb://" . config('database.connections.logs.host') . ":" . config('database.connections.logs.port'),
            $clientOptions
        );


        // Create database and a collection to ensure the database is created
        $db = $client->selectDatabase($databaseName);
        $db->createCollection('logs');
    }

    private function getTenantById($tenantId) {
        return DB::table('tenants')->where('id', $tenantId)->first();
    }
}
