<?php

namespace Modules\Auth\Helper;
use Illuminate\Support\Str;

class UserHelper {
    public static function generateUsername($email) {
        $username = strtok($email, '@');
        $username = $username . Str::random(4);

        return $username;
    }
}
