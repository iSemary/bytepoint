<?php

namespace App\Models\Tenant;

use Laravel\Passport\Token as PassportToken;

class OAuthAccessToken extends PassportToken {
    protected $connection = 'tenant';
}
