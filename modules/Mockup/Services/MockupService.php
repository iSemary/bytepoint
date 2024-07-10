<?php

namespace Modules\Mockup\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Modules\Api\Entities\Method;

class MockupService
{
    public function run(Request $request)
    {
        $method = Method::where("id", $request->method)->first()->title;

        list($headers, $parameters, $body) = $this->prepare($request);

        return $this->process($request->endpoint, $method, $headers, $parameters, $body);
    }

    private function prepare(Request $request)
    {
        $headers = [];
        foreach ($request->base_headers as $header) {
            if (isset($header['key'])) {
                $headers[$header['key']['label']] = $header['value'];
            }
        }

        $parameters = [];
        foreach ($request->base_parameters as $parameter) {
            if (isset($parameter['key'])) {
                $parameters[$parameter['key']] = $parameter['value'];
            }
        }

        $body = [];
        foreach ($request->base_body as $bodyItem) {
            if (isset($bodyItem['key'])) {
                $body[$bodyItem['key']] = $bodyItem['value'];
            }
        }

        return [$headers, $parameters, $body];
    }

    private function process($endpoint, $method, $headers, $parameters, $body)
    {
        $request = Http::withHeaders($headers);

        switch (strtoupper($method)) {
            case 'GET':
                $response = $request->get($endpoint, $parameters);
                break;
            case 'POST':
                $response = $request->post($endpoint, $body);
                break;
            case 'PUT':
                $response = $request->put($endpoint, $body);
                break;
            case 'DELETE':
                $response = $request->delete($endpoint, $parameters);
                break;
            default:
                throw new \InvalidArgumentException("Invalid HTTP method: $method");
        }

        // Handle the response
        if ($response->successful()) {
            return $response->json();
        } else {
            throw new \Exception("HTTP request failed: " . $response->body());
        }
    }
}
