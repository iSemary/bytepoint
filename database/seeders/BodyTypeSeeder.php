<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Api\Entities\BodyType;

class BodyTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedBodyTypes();
    }

    private function seedBodyTypes()
    {
        $bodyTypes = [
            [
                'title' => 'multipart/form-data',
                'description' => 'Used for uploading files via forms.'
            ],
            [
                'title' => 'application/x-www-form-urlencoded',
                'description' => 'Used for sending form data in a URL-encoded format.'
            ],
            [
                'title' => 'application/json',
                'description' => 'Used for sending JSON data in the body of the request.'
            ],
            [
                'title' => 'application/octet-stream',
                'description' => 'Used for sending binary data.'
            ],
            [
                'title' => 'application/graphql',
                'description' => 'Used for sending GraphQL queries and mutations.'
            ],
        ];

        foreach ($bodyTypes as $bodyType) {
            BodyType::updateOrCreate(
                ['title' => $bodyType['title']],
                $bodyType
            );
        }
    }
}
