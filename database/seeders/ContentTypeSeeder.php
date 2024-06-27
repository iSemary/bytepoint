<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Api\Entities\ContentType;

class ContentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedContentTypes();
    }

    private function seedContentTypes()
    {
        $contentTypes = [
            ['title' => 'application/atom+xml'],
            ['title' => 'application/ecmascript'],
            ['title' => 'application/graphql'],
            ['title' => 'application/json'],
            ['title' => 'application/ld+json'],
            ['title' => 'application/octet-stream'],
            ['title' => 'application/pdf'],
            ['title' => 'application/rss+xml'],
            ['title' => 'application/vnd.api+json'],
            ['title' => 'application/xhtml+xml'],
            ['title' => 'application/xml'],
            ['title' => 'application/x-www-form-urlencoded'],
            ['title' => 'image/gif'],
            ['title' => 'image/jpeg'],
            ['title' => 'image/png'],
            ['title' => 'multipart/form-data'],
            ['title' => 'text/calendar'],
            ['title' => 'text/css'],
            ['title' => 'text/csv'],
            ['title' => 'text/html'],
            ['title' => 'text/plain'],
            ['title' => 'text/xml'],
        ];

        foreach ($contentTypes as $contentType) {
            ContentType::updateOrCreate(
                ['title' => $contentType['title']],
                $contentType
            );
        }
    }
}
