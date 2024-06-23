<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $this->seedRoles();
        $this->seedPermissions();
        $this->seedPermissionsToRoles();
    }

    private function seedRoles() {
        $roles = [
            [
                'name' => 'owner',
                'guard_name' => 'api'
            ],
            [
                'name' => 'super_admin',
                'guard_name' => 'api'
            ],
            [
                'name' => 'admin',
                'guard_name' => 'api'
            ],
            [
                'name' => 'viewer',
                'guard_name' => 'api'
            ]
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                $role
            );
        }
    }

    private function seedPermissions() {
        $resources = [
            'mockups',
            'apis',
            'data_repositories',
            'cloud_services',
            'file_manager',
            'api_key_management',
            'user_management',
            'logs',
            'templates',
        ];
        $actions = ['view', 'create', 'update', 'delete'];

        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                Permission::updateOrCreate(
                    ['name' => "$action.$resource", 'guard_name' => 'api'],
                    ['name' => "$action.$resource", 'guard_name' => 'api']
                );
            }
        }
    }

    private function seedPermissionsToRoles() {
        $roles = ['owner', 'super_admin'];
        $permissions = Permission::all();

        foreach ($roles as $roleName) {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $role->syncPermissions($permissions);
            }
        }
    }
}
