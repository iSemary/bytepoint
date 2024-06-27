<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Multitenancy\Models\Tenant;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Tenant::current()) {
            $this->call([
                RolePermissionSeeder::class,
                PassportSeeder::class,
                MethodSeeder::class,
                HeaderSeeder::class,
                ContentTypeSeeder::class,
            ]);
        } else {
            $this->call(UtilitySeeder::class);
        }
    }
}
