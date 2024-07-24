<?php

namespace Modules\Api\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Modules\Api\Entities\Api;
use Modules\Api\Services\Cloud\OCRService;

class ApiTemplateProcessor
{
    public function ipToLocation(Request $request): array
    {
        $ip = $request->ip;
        $url = "http://ip-api.com/json/{$ip}";

        try {
            $response = Http::get($url);
            if ($response->successful()) {
                return $response->json();
            } else {
                return ['error' => 'Failed to fetch data from IP API', 'status' => $response->status()];
            }
        } catch (\Exception $e) {
            return ['error' => 'An error occurred', 'message' => $e->getMessage()];
        }
    }

    public function ocr(Api $api, Request $request)
    {
        return (new OCRService)->process($api, $request);
    }
}
