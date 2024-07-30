<?php

namespace Database\Seeders;


use App\Models\Category;
use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\CreationType;
use App\Models\DataType;
use Modules\Api\Entities\ApiPurpose;
use Modules\Template\Entities\Template;
use Modules\GPT\Entities\Prompt;

class UtilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedCountries();
        $this->seedCategories();
        $this->seedDataTypes();
        $this->seedCreationTypes();
        $this->seedPrompts();
        $this->seedApiPurposes();
        $this->seedTemplates();
    }

    private function seedCountries()
    {
        $countries = [
            [
                "iso" => "EG",
                "name" => "Egypt",
                "iso3" => "EGY",
                "num_code" => 818,
                "phone_code" => 20,
                "continent_code" => "AF",
                "status" => 1
            ],
            [
                "iso" => "US",
                "name" => "United States",
                "iso3" => "USA",
                "num_code" => 840,
                "phone_code" => 1,
                "continent_code" => "NA",
                "status" => 1
            ],
            [
                "iso" => "DE",
                "name" => "Germany",
                "iso3" => "DEU",
                "num_code" => 276,
                "phone_code" => 49,
                "continent_code" => "EU",
                "status" => 1
            ]
        ];

        foreach ($countries as $country) {
            Country::updateOrCreate(
                ["iso" => $country["iso"]],
                $country
            );
        }
    }

    private function seedCategories()
    {

        $categories = [
            ["title" => "Business"],
            ["title" => "Finance"],
            ["title" => "Software"],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ["title" => $category["title"]],
                $category
            );
        }
    }

    private function seedDataTypes()
    {
        $types = [
            ["title" => "string"],
            ["title" => "integer"],
            ["title" => "float"],
            ["title" => "boolean"],
            ["title" => "date"],
            ["title" => "iso date"],
        ];

        foreach ($types as $type) {
            DataType::updateOrCreate(
                ["title" => $type["title"]],
                $type
            );
        }
    }
    private function seedCreationTypes()
    {
        $types = [
            ["title" => "Manual", "description" => "Create your own API using the API builder", "icon" => "Construction"],
            ["title" => "Import", "description" => "Import xlsx or csv file", "icon" => "UploadFileIcon"],
            ["title" => "AI Copilot", "description" => "Unleash your creativity with our AI Copilot", "icon" => "AutoAwesomeIcon"],
        ];

        foreach ($types as $type) {
            CreationType::updateOrCreate(
                ["title" => $type["title"]],
                $type
            );
        }
    }

    private function seedPrompts()
    {
        $prompts = [
            [
                "title" => "Generate Values For Data Repository",
                "body" => 'System Role: Data Provider
    Primary Instructions:
    - Return data strictly based on the columns specified by the user.
    - Do not include any codes, examples, or additional information.
    - Respond only with the requested data in the format specified by the user.
    - Always respond in the language used by the user.
    
    Data Repository:
    - Provide a "data_repository" section containing an array of the requested data.
    - The data should be formatted according to the user\'s specifications.
    
    Response Format:
    - Provide data in the format specified by the user, without any additional formatting or explanations.
    - The response should be in a JSON structure.
    
    Example structure (adjust based on user request):
    {
      "data_repository": [
        {"id": 1, "name": "Technology"},
        {"id": 2, "name": "Health"},
        {"id": 3, "name": "Education"},
        {"id": 4, "name": "Finance"},
        {"id": 5, "name": "Travel"},
        {"id": 6, "name": "Food"},
        {"id": 7, "name": "Entertainment"},
        {"id": 8, "name": "Sports"},
        {"id": 9, "name": "Fashion"},
        {"id": 10, "name": "Lifestyle"}
      ]
    }',
                "type" => Prompt::DATA_REPOSITORY_TYPE
            ],
            [
                "title" => "Generate API with it's Data Repository",
                "body" => 'System Role: Data Provider
        Primary Instructions:

        Return data strictly based on the columns specified by the user.
        Do not include any codes, examples, or additional information.
        Respond only with the requested data in the format specified by the user.
        Always respond in the language used by the user.

        Conditional Elements:

        If the user requests an API:
        Add an "api_configuration" section with the following details:

        title: Brief description of the API purpose
        description: Detailed explanation of the API purpose
        type: 1 for data retrieval, 2 for data storage
        method: HTTP method (GET/POST)
        end_point: Single word describing API purpose (e.g., "/get-cats" or "/save-cat")
        body (optional): Array of key-value pairs for data saving APIs


        If the user requests data to be returned in the API response:
        Add a "data_repository" section containing an array of the requested data.

        Response Format:
        Provide data in the format specified by the user, without any additional formatting or explanations.
        This enhanced version:

        Clearly defines the system role and main instructions
        Organizes conditional elements (API configuration and data repository) more systematically
        Removes redundant information and simplifies the overall structure
        Maintains all key requirements from the original prompt
        Presents the information in a clear, easy-to-read format in a JSON structure',
                "type" => Prompt::API_TYPE
            ],
        ];

        foreach ($prompts as $prompt) {
            Prompt::updateOrCreate(
                ["type" => $prompt["type"]],
                $prompt
            );
        }
    }

    private function seedApiPurposes()
    {
        $apiPurposes = [
            ["title" => "Retrieve Data", "type" => "retrieve", "description" => "Purpose to retrieve data from the data repository"],
            ["title" => "Store Data", "type" => "store", "description" => "Purpose to store data into the data repository"],
        ];

        foreach ($apiPurposes as $apiPurpose) {
            ApiPurpose::updateOrCreate(
                ["type" => $apiPurpose["type"]],
                $apiPurpose
            );
        }
    }

    private function seedTemplates()
    {
        $Templates = [
            [
                "title" => "Fetch Paginated Data",
                "slug" => "fetch-paginated-data",
                "description" => "Fetch and manage paginated data with ease",
                "icon" => "dataAnimation",
                "type" => "fetch_paginated_data",
                "is_cloud" => false,
            ],
            [
                "title" => "Contact Us",
                "slug" => "contact-us",
                "description" => "Set up a contact form quickly and efficiently",
                "icon" => "contactUsAnimation",
                "type" => "contact_us",
                "is_cloud" => false,
            ],
            [
                "title" => "Newsletter",
                "slug" => "newsletter",
                "description" => "Easily create and manage newsletters",
                "icon" => "newsletterAnimation",
                "type" => "newsletter",
                "is_cloud" => false,
            ],
            [
                "title" => "IP to Location",
                "slug" => "ip-to-location",
                "description" => "Determine the geographical location of an IP address",
                "icon" => "locationAnimation",
                "type" => "ip_to_location",
                "is_cloud" => false,
            ],
            [
                "title" => "OCR",
                "slug" => "ocr",
                "description" => "Transform your images into readable text with our powerful OCR API. Perfect for data extraction and document digitization.",
                "icon" => "ocrAnimation",
                "type" => "ocr",
                "is_cloud" => true,
            ],
        ];

        foreach ($Templates as $Template) {
            Template::updateOrCreate(
                ["type" => $Template["type"]],
                $Template
            );
        }
    }
}
