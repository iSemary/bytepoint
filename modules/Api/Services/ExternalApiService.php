<?php

namespace Modules\Api\Services;

use Exception;
use Illuminate\Http\JsonResponse;
use Modules\Api\Entities\Api;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Api\Entities\ApiPurpose;
use Modules\DataRepository\Entities\DataRepositoryValue;
use Modules\DataRepository\Services\DataRepositoryService;
use Modules\Log\Services\LogService;

class ExternalApiService
{
    protected $apiService;
    protected $apiValidatorService;
    protected $dataRepositoryService;
    protected $logService;

    public function __construct(ApiService $apiService, ApiValidatorService $apiValidatorService, DataRepositoryService $dataRepositoryService, LogService $logService)
    {
        $this->apiService = $apiService;
        $this->apiValidatorService = $apiValidatorService;
        $this->dataRepositoryService = $dataRepositoryService;
        $this->logService = $logService;
    }

    public function run(int $id, Request $request): JsonResponse
    {
        // Prepare API objects [Headers, Parameters, Body, etc...]
        $api = $this->apiService->prepare($id);
        try {
            // Validate Incoming request
            $this->apiValidatorService->validate($api, $request);
            // Process the api functionality based on it's purpose 
            $response = $this->process($api, $request);
            // Log the data
            $this->logService->log("API", $api->title, "INFO", ['request' => $this->formatRequest($request), 'response' => $response], false);
            return response()->json($response, 200);
        } catch (Exception $e) {
            $this->logService->log("API", $api->title, "ERROR", ['message' => $e->getMessage()], true);
            return response()->json(['message' => "Internal Server Error"], 400);
        }
    }

    private function process(Api $api, Request $request)
    {
        $purpose = ApiPurpose::find($api->type);
        switch ($purpose->type) {
            case 'retrieve':
                return $this->retrieveData($api, $request);
                break;
            case 'store':
                return $this->storeData($api, $request);
                break;
            default:
                break;
        }
    }

    private function retrieveData(Api $api, Request $request): array
    {
        $response = [];

        if ($this->dataRepositoryService->hasKeys($api->data_repository_id) && $this->dataRepositoryService->hasValues($api->data_repository_id)) {
            if ($api->settings->allow_paginator) {
                $dataRepositoryValues = $this->dataRepositoryService->paginate($api->data_repository_id);
            } else {
                $dataRepositoryValues = $this->dataRepositoryService->all($api->data_repository_id);
            }

            $response = $dataRepositoryValues;

            if ($api->settings->allow_counter) {
                $response['total'] = $this->dataRepositoryService->count($api->data_repository_id);
            }
            $response['status'] = Response::HTTP_OK;
            $response['success'] = true;
        } else {
            $response['status'] = Response::HTTP_NOT_FOUND;
            $response['success'] = false;
            $response['message'] = "There's no data found in the repository.";
        }

        return $response;
    }

    private function storeData(Api $api, Request $request): array
    {
        $response = [];
        if ($this->dataRepositoryService->hasKeys($api->data_repository_id)) {
            $dataRepositoryKeys = $this->dataRepositoryService->returnKeys($api->data_repository_id);

            foreach ($dataRepositoryKeys as $dataRepositoryKey) {
                DataRepositoryValue::create([
                    'data_repository_key_id' => $dataRepositoryKey->id,
                    'data_repository_value' => $request->input($dataRepositoryKey->data_repository_key)
                ]);
            }

            $response['status'] = Response::HTTP_OK;
            $response['success'] = true;
            $response['message'] = "Data Stored Successfully";
        } else {
            $response['status'] = Response::HTTP_NOT_FOUND;
            $response['success'] = false;
            $response['message'] = "There's no keys found in the repository.";
        }

        return $response;
    }
    
    private function formatRequest(Request $request): array
    {
        return [
            'agent' => $request->header('User-Agent'),
            'location' => $request->url(),
            'body_data' => $request->all(),
            'json_body' => $request->json()->all(),
            'params' => $request->query(),
            'headers' => $request->headers->all(),
        ];
    }
    
}
