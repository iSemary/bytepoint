<?php

namespace Modules\Mockup\Services;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Modules\Api\Entities\Method;
use Modules\Api\Services\ApiService;
use Modules\Mockup\Entities\Mockup;
use stdClass;

class MockupService
{
    protected $apiService;

    public function __construct(ApiService $apiService)
    {
        $this->apiService = $apiService;
    }
    /**
     * Executes the mockup service with the given request.
     * 
     * @param Request $request
     * @return mixed
     */
    public function run(Request $request)
    {
        $method = Method::where("id", $request->method)->first()->title;

        list($headers, $parameters, $body) = $this->prepare($request);

        return $this->process($request->endpoint, $method, $headers, $parameters, $body);
    }

    /**
     * Method for storing data.
     * 
     * @param Request $request
     */
    public function store($request)
    {
        try {
            DB::beginTransaction();
            // Save base API
            $baseApiData = $this->prepareBaseApiData($request);
            $baseApi = $this->apiService->store($baseApiData);
            // Save mockup API
            $mockupApiData = $this->prepareMockupApiData($request);
            $mockupApi = $this->apiService->store($mockupApiData);
            // Save Mockup Row Model
            $mockup = Mockup::create([
                'title' => $request['title'],
                'description' => $request['description'],
                'base_api_id' => $baseApi['api']['id'],
                'mocked_api_id' => $mockupApi['api']['id'],
            ]);
            DB::commit();
            return ['success' => true, 'mockup' => $mockup];
        } catch (Exception $e) {
            DB::rollBack();
            throw new \Exception($e->getMessage() . " L" . $e->getLine());
        }
    }


    private function prepareBaseApiData($request)
    {
        $api = [];
        $api['title'] = $request['title'] . " Base";
        $api['purpose_id'] = $request['purpose_id'];
        $api['description'] = $request['description'] . " Base";
        $api['method_id'] = $request['base_method_id'];
        $api['body_type_id'] = $request['base_body_type_id'];
        $api['end_point'] = $request['base_end_point'];
        $api['headers'] = $request['base_headers'];
        $api['body'] = $request['base_body'];
        $api['parameters'] = $request['base_parameters'];

        return $api;
    }
    private function prepareMockupApiData($request)
    {
        $api = [];
        $api['title'] = $request['title'] . " Mockup";
        $api['purpose_id'] = $request['purpose_id'];
        $api['description'] = $request['description'] . " Mockup";
        $api['method_id'] = $request['mock_method_id'];
        $api['body_type_id'] = $request['mock_body_type_id'];
        $api['end_point'] = $request['mock_end_point'];
        $api['headers'] = $request['mock_headers'];
        $api['body'] = $request['mock_body'];
        $api['parameters'] = $request['mock_parameters'];

        return $api;
    }

    /**
     * Prepares the headers, parameters, and body from the request.
     * 
     * @param Request $request
     * @return array
     */
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

    /**
     * Processes the HTTP request to the given endpoint with the specified method, headers, parameters, and body.
     * 
     * @param string $endpoint
     * @param string $method
     * @param array $headers
     * @param array $parameters
     * @param array $body
     * @return mixed
     * @throws \InvalidArgumentException
     * @throws \Exception
     */
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
