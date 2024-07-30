<?php

namespace Modules\GPT\Http\Controllers;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Modules\Api\Entities\Method;
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
        // Find the position of the first '{' and last '}'
        $start = strpos($response, '{');
        $end = strrpos($response, '}');

        // Extract the JSON content if both '{' and '}' are found
        if ($start !== false && $end !== false) {
            $jsonContent = substr($response, $start, $end - $start + 1);
        } else {
            return "Error: No valid JSON object found";
        }

        // Decode the JSON
        $data = json_decode($jsonContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return "Error: Invalid JSON response";
        }

        $result = [];

        // Check for api_configuration
        if (isset($data['api_configuration'])) {
            $result['api_configuration'] = $this->formatApiConfiguration($data['api_configuration']);
            $result['api_configuration_empty'] = empty($data['api_configuration']);
        }

        // Check for data_repository
        if (isset($data['data_repository'])) {
            $result['data_repository'] = $data['data_repository'];
            $result['data_repository_count'] = count($data['data_repository']);
        }
        
        return $result;
    }

    private function formatApiConfiguration(array $apiConfiguration): array
    {
        if (isset($apiConfiguration['method'])) {
            $method = Method::whereTitle($apiConfiguration['method'])->first();
            if ($method) $apiConfiguration['method'] = $method->id;
        }
        return $apiConfiguration;
    }
}
