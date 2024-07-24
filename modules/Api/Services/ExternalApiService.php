<?php

namespace Modules\Api\Services;

use App\Constants\ApiServices;
use Illuminate\Http\JsonResponse;
use Modules\Api\Entities\Api;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Api\Entities\ApiPurpose;
use Modules\DataRepository\Entities\DataRepositoryValue;
use Modules\DataRepository\Services\DataRepositoryService;
use Modules\Log\Services\LogService;
use Modules\Template\Entities\Template;
use Exception;

class ExternalApiService
{
    protected $apiService;
    protected $apiValidatorService;
    protected $dataRepositoryService;
    protected $apiTemplateProcessor;
    protected $logService;
    protected $service;

    public function __construct(
        ApiService $apiService,
        ApiValidatorService $apiValidatorService,
        DataRepositoryService $dataRepositoryService,
        ApiTemplateProcessor $apiTemplateProcessor,
        LogService $logService
    ) {
        $this->apiService = $apiService;
        $this->apiValidatorService = $apiValidatorService;
        $this->dataRepositoryService = $dataRepositoryService;
        $this->apiTemplateProcessor = $apiTemplateProcessor;
        $this->logService = $logService;
        $this->service = "API";
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
            $this->logService->log($this->service, $api->title, "INFO", ['request' => $this->formatRequest($request), 'response' => $response], false);
            return response()->json($response, 200);
        } catch (Exception $e) {
            $this->logService->log("API", $api->title, "ERROR", ['message' => $e->getMessage()], true);
            return response()->json(['message' =>  $e->getMessage()], 400);
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
                if ($request->input($dataRepositoryKey->data_repository_key)) {
                    DataRepositoryValue::create([
                        'data_repository_key_id' => $dataRepositoryKey->id,
                        'data_repository_value' => $request->input($dataRepositoryKey->data_repository_key)
                    ]);
                }
            }

            if (in_array($api->service, [ApiServices::Template, ApiServices::CloudService])) {
                $response = $this->processApiTemplate($api, $request);
                $this->service = ApiServices::getTitle($api->service);
            }

            $response['status'] = Response::HTTP_OK;
            $response['success'] = true;
            $response['message'] = $this->returnMessageResponse($api, "Data Stored Successfully");
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

    private function processApiTemplate(Api $api, Request $request): array
    {
        $response = [];

        $template = Template::where("id", $api->template_id)->first();

        switch ($template->type) {
            case 'ip_to_location':
                $response = $this->apiTemplateProcessor->ipToLocation($request);
                break;
            case 'ocr':
                $response = $this->apiTemplateProcessor->ocr($api, $request);
                break;
            default:
                break;
        }

        return $response;
    }

    private function returnMessageResponse($api, $defaultMessage = "")
    {
        $apiResponseMessage = $this->apiService->prepareResponses($api, "message");
        return $apiResponseMessage ? $apiResponseMessage->response_value : $defaultMessage;
    }
}
