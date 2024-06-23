<?php
namespace Database\Seeders;


use App\Models\Category;
use Illuminate\Database\Seeder;
use App\Models\Country;

class UtilitySeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $this->seedCountries();
        $this->seedCategories();
    }

    private function seedCountries() {
        $countries = [
            [
                'iso' => 'EG',
                'name' => 'Egypt',
                'iso3' => 'EGY',
                'num_code' => 818,
                'phone_code' => 20,
                'continent_code' => 'AF',
                'status' => 1
            ],
            [
                'iso' => 'US',
                'name' => 'United States',
                'iso3' => 'USA',
                'num_code' => 840,
                'phone_code' => 1,
                'continent_code' => 'NA',
                'status' => 1
            ],
            [
                'iso' => 'DE',
                'name' => 'Germany',
                'iso3' => 'DEU',
                'num_code' => 276,
                'phone_code' => 49,
                'continent_code' => 'EU',
                'status' => 1
            ]
        ];

        foreach ($countries as $country) {
            Country::updateOrCreate(
                ['iso' => $country['iso']],
                $country
            );
        }
    }

    private function seedCategories() {

        $categories = [
            ['title' => 'Business'],
            ['title' => 'Finance'],
            ['title' => 'Software'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['title' => $category['title']],
                $category
            );
        }
    }
}
