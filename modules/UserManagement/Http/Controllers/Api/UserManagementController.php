<?php

namespace Modules\UserManagement\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\UserManagement\Http\Requests\StoreUserRequest;
use Modules\UserManagement\Http\Requests\UpdateUserRequest;
use Modules\UserManagement\Services\UserManagementService;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserManagementController extends ApiController
{
    protected $userManagementService;

    public function __construct(UserManagementService $userManagementService)
    {
        $this->userManagementService = $userManagementService;
    }

    /**
     * Fetch all user management
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $keyword = $request->input('keyword');
        $query = User::query();

        $query->whereDoesntHave('roles', function ($query) {
            $query->where('name', 'super_admin');
        });

        $query->withTrashed();

        if ($keyword) {
            $query->where('title', 'like', '%' . $keyword . '%');
        }
        $users = $query->paginate(25);
        return $this->return(200, "Users Fetched Successfully", ['users' => $users]);
    }

    /**
     * Show the specified User
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $user = $this->userManagementService->get($id);
        return $this->return(200, "User Fetched Successfully", ['user' => $user]);
    }

    /**
     * Store the User
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $storeUserRequest): JsonResponse
    {
        // Validate the incoming request
        $validatedData = $storeUserRequest->validated();
        $user = $this->userManagementService->create($validatedData);
        return $this->return(200, "User Stored Successfully", ['user' => $user]);
    }

    /**
     * Update the existing User
     *
     * @param integer $id
     * @param Request $request
     * @return JsonResponse
     */
    public function update(int $id, UpdateUserRequest $updateUserRequest): JsonResponse
    {
        // Validate the incoming request
        $validatedData = $updateUserRequest->validated();
        $user = $this->userManagementService->update($id, $validatedData);

        return $this->return(200, "User Updated Successfully", ['user' => $user]);
    }

    /**
     * Remove the specified User.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return $this->return(200, "User Deleted Successfully");
    }

    /**
     * Restore the specified User.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function restore(int $id): JsonResponse
    {
        $user = User::withTrashed()->findOrFail($id);

        if ($user->trashed()) {
            $user->restore();

            return $this->return(200, "User Restored Successfully");
        }

        return $this->return(404, "User not found or not soft deleted");
    }

    public function prepare(): JsonResponse
    {
        $roles = Role::whereNotIn('name', ['owner', 'super_admin'])->get();
        $permissions = Permission::get();

        return $this->return(200, "Data prepared successfully", [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }
}
