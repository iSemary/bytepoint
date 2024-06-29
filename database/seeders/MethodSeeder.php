<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Api\Entities\Method;

class MethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedMethods();
    }

    private function seedMethods()
    {
        $methods = [
            ['title' => 'GET'],
            ['title' => 'POST'],
            ['title' => 'PUT'],
            ['title' => 'PATCH'],
            ['title' => 'DELETE'],
            ['title' => 'OPTIONS'],
            ['title' => 'HEAD'],
            ['title' => 'CONNECT'],
            ['title' => 'TRACE'],
        ];

        foreach ($methods as $method) {
            Method::updateOrCreate(
                ['title' => $method['title']],
                $method
            );
        }
    }
}
