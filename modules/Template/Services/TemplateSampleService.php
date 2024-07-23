<?php

namespace Modules\Template\Services;

use Modules\Template\Entities\Template;

class TemplateSampleService
{
    public function generate(Template $template)
    {
        return [
            'request' => $this->generateRequest($template),
            'response' => $this->generateResponse($template),
        ];
    }

    public function generateRequest(Template $template)
    {
        switch ($template->type) {
            case 'fetch_paginated_data':
                return [
                    'page' => 1,
                    'per_page' => 10,
                    'sort_by' => 'created_at',
                    'order' => 'desc'
                ];
            case 'contact_us':
                return [
                    'name' => 'John Doe',
                    'email' => 'john.doe@example.com',
                    'message' => 'Your message here'
                ];
            case 'newsletter':
                return [
                    'email' => 'john.doe@example.com',
                ];
            case 'ip_to_location':
                return [
                    'ip' => '192.168.1.1',
                ];
            case 'ocr':
                return [
                    'image' => 'base64_encoded_image_string',
                ];
            default:
                return [];
        }
    }

    public function generateResponse(Template $template)
    {
        switch ($template->type) {
            case 'fetch_paginated_data':
                return [
                    'data' => [],
                    'pagination' => [
                        'current_page' => 1,
                        'total' => 100,
                        'per_page' => 10,
                        'last_page' => 10,
                    ],
                    'total' => 100,
                ];
            case 'contact_us':
                return [
                    'success' => true,
                    'message' => 'Thank you for contacting us!'
                ];
            case 'newsletter':
                return [
                    'success' => true,
                    'message' => 'You have successfully subscribed to the newsletter!'
                ];
            case 'ip_to_location':
                return [
                    'ip' => '192.168.1.1',
                    'country' => 'United States',
                    'region' => 'California',
                    'city' => 'Los Angeles'
                ];
            case 'ocr':
                return [
                    'text' => 'Extracted text from image'
                ];
            default:
                return [];
        }
    }
}
