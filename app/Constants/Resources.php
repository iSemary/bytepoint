<?php
namespace App\Constants;

class Resources {
    public static function getResources() {
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

        return $resources;
    }
}
