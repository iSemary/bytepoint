<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\Client;
use Laravel\Passport\PersonalAccessClient;

class PassportSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $personalAccess = DB::connection("landlord")->table("oauth_clients")->first();
        
        $client = Client::create([
            'name' => 'Personal Access Client',
            'secret' => $personalAccess->secret,
            'redirect' => "http://localhost",
            'personal_access_client' => $personalAccess->id,
            'password_client' => '0',
            'revoked' => '0',
        ]);

        PersonalAccessClient::create([
            'client_id' => $client->id,
        ]);
    }
}
