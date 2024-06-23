<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Multitenancy\Models\Tenant;

class AppController extends Controller {
    public function index() {
        $tenant = Tenant::current();
        dd($tenant);
    }
}
