<?php

namespace Modules\UserManagement\Services;

use App\Models\User;
use Modules\Auth\Helper\UserHelper;
use Spatie\Permission\Models\Role;

class UserManagementService
{
    public function create($request)
    {
        $auth = auth()->guard('api')->user();

        // Extract data from the request
        $data = [
            'name' => $request['name'],
            'email' => $request['email'],
            'username' => UserHelper::generateUsername($request['email']),
            'password' => bcrypt($request['password']),
            'role_id' => $request['role_id'],
            'country_id' => $request['country_id'],
            'customer_id' => $auth->customer_id,
            'factor_authenticate' => true,
        ];

        // Create the user
        $user = User::create($data);

        // Assign role
        if (isset($request['role_id'])) {
            $role = Role::find($request['role_id']);
            if ($role) {
                $user->assignRole($role);
            }
        }

        // Assign permissions
        if (isset($request['permissions'])) {
            $user->syncPermissions(array_values($request['permissions']));
        }

        return $user;
    }

    public function get(int $id)
    {
        $user = User::findOrFail($id);

        $data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'username' => $user->username,
            'role_id' => $user->roles->first()->id ?? null,
            'country_id' => $user->country_id,
            'customer_id' => $user->customer_id,
            'factor_authenticate' => $user->factor_authenticate,
        ];

        // Get user permissions
        $permissions = $user->permissions->pluck('id', 'id')->toArray();
        $data['permissions'] = $permissions;

        return $data;
    }

    public function update(int $id, $request)
    {
        $user = User::findOrFail($id);

        // Extract data from the request
        $data = [
            'name' => $request['name'],
            'email' => $request['email'],
            'country_id' => $request['country_id'],
        ];

        // Update password if provided
        if (!empty($request['password'])) {
            $data['password'] = bcrypt($request['password']);
        }

        // Update the user info
        $user->update($data);

        // Update role
        if (isset($request['role_id'])) {
            $role = Role::find($request['role_id']);
            if ($role) {
                $user->syncRoles([$role]);
            }
        }

        // Update permissions
        if (isset($request['permissions'])) {
            $user->syncPermissions(array_values($request['permissions']));
        }

        return $user->fresh();
    }
}
