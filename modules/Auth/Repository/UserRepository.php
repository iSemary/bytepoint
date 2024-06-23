<?php

namespace Modules\Auth\Repository;

use App\Models\User;
use Modules\Auth\Helper\UserHelper;

class UserRepository {
    public function create($userRequest) {
        $userRequest['username'] = UserHelper::generateUsername($userRequest['email']);
        $user = User::create($userRequest);
        $user->assignRole("super_admin");

        return $user;
    }
}
