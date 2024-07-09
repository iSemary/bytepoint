<?php

namespace Modules\Template\Services;

use Modules\Template\Entities\Template;

class TemplateSampleService
{
    public function generate(Template $template)
    {
        $sample = [
            'request' => [],
            'response' => [],
        ];

        switch ($template->type) {
            case 'fetch_paginated_data':
                $sample['request'] = [
                    'page' => 1,
                    'per_page' => 10,
                    'sort_by' => 'created_at',
                    'order' => 'desc'
                ];
                $sample['response'] = [
                    'data' => [],
                    'pagination' => [
                        'current_page' => 1,
                        'total' => 100,
                        'per_page' => 10,
                        'last_page' => 10,
                    ],
                    'total' => 100,
                ];
                break;
            case 'contact_us':
                $sample['request'] = [
                    'name' => 'John Doe',
                    'email' => 'john.doe@example.com',
                    'message' => 'Your message here'
                ];
                $sample['response'] = [
                    'success' => true,
                    'message' => 'Thank you for contacting us!'
                ];
                break;
            case 'newsletter':
                $sample['request'] = [
                    'email' => 'john.doe@example.com',
                ];
                $sample['response'] = [
                    'success' => true,
                    'message' => 'You have successfully subscribed to the newsletter!'
                ];
                break;
            case 'ip_to_location':
                $sample['request'] = [
                    'ip' => '192.168.1.1',
                ];
                $sample['response'] = [
                    'ip' => '192.168.1.1',
                    'country' => 'United States',
                    'region' => 'California',
                    'city' => 'Los Angeles'
                ];
                break;
            case 'ocr':
                $sample['request'] = [
                    'image' => 'base64_encoded_image_string',
                ];
                $sample['response'] = [
                    'text' => 'Extracted text from image'
                ];
                break;
            default:
                break;
        }

        return $sample;
    }
}
