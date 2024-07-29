<?php

namespace Modules\GPT\Http\Controllers;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Modules\GPT\Http\Requests\GenerateRequest;
use Modules\GPT\Services\GPTService;

class GPTController extends ApiController
{
    protected $gptService;

    public function __construct(GPTService $gptService)
    {
        $this->gptService = $gptService;
    }

    public function generate(GenerateRequest $generateRequest): JsonResponse
    {
        $validatedData = $generateRequest->validated();
        $response = $this->gptService->generate($validatedData['type'], $validatedData['text']);
        $response = $this->processResponse($response);
        return $this->return(200, "Response fetched successfully", ['response' => $response]);
    }

    public function processResponse($response)
    {
        // Remove any additional text before the JSON data
        $jsonStart = strpos($response, '{');
        if ($jsonStart !== false) {
            $response = substr($response, $jsonStart);
        }

        // Decode the JSON
        $data = json_decode($response, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return "Error: Invalid JSON response";
        }

        $result = [];

        // Check for data_repository
        if (isset($data['data_repository'])) {
            $result['data_repository'] = $data['data_repository'];
            $result['data_repository_count'] = count($data['data_repository']);
        }

        // Check for api_configuration
        if (isset($data['api_configuration'])) {
            $result['api_configuration'] = $data['api_configuration'];
            $result['api_configuration_empty'] = empty($data['api_configuration']);
        }

        return $result;
    }
}
