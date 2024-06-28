<?php

namespace Database\Seeders;

use App\Constants\Resources;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    private $resources;

    public function __construct()
    {
        $this->resources = Resources::getResources();
    }
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedRoles();
        $this->seedPermissions();
        $this->seedPermissionsToRoles();
    }

    private function seedRoles()
    {
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

    private function seedPermissions()
    {

        $actions = ['view', 'create', 'update', 'delete'];

        foreach ($this->resources as $resource) {
            foreach ($actions as $action) {
                Permission::updateOrCreate(
                    ['name' => "$action.$resource", 'guard_name' => 'api'],
                    ['name' => "$action.$resource", 'guard_name' => 'api']
                );
            }
        }
    }

    private function seedPermissionsToRoles()
    {
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
