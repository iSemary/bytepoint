<?php

namespace Modules\Api\Services;

use App\Constants\ApiServices;
use App\Constants\DataTypes;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Modules\Api\Entities\Api;
use Modules\Api\Entities\ApiHeader;
use Modules\Api\Entities\ApiParameter;
use Modules\Api\Entities\ApiBody;
use Modules\Api\Entities\ApiPurpose;
use Modules\Api\Entities\ApiResponse;
use Modules\Api\Entities\ApiSetting;
use Modules\Api\Entities\ApiVersion;
use Modules\DataRepository\Entities\DataRepository;
use Modules\DataRepository\Entities\DataRepositoryKey;
use Modules\Api\Services\Api\BodyService;
use Modules\Api\Services\Api\HeaderService;
use Modules\Api\Services\Api\ParameterService;
use Modules\Api\Services\PostmanService;
use Modules\DataRepository\Services\DataRepositoryService;

class ApiService
{
    public $headerService;
    public $parameterService;
    public $bodyService;
    public $apiPreparationService;
    public $postmanService;
    public $dataRepositoryService;

    public function __construct(
        HeaderService $headerService,
        ParameterService $parameterService,
        BodyService $bodyService,
        ApiPreparationService $apiPreparationService,
        PostmanService $postmanService,
        DataRepositoryService $dataRepositoryService,
    ) {
        $this->headerService = $headerService;
        $this->parameterService = $parameterService;
        $this->bodyService = $bodyService;
        $this->apiPreparationService = $apiPreparationService;
        $this->postmanService = $postmanService;
        $this->dataRepositoryService = $dataRepositoryService;
    }

    public function prepare(int $id)
    {
        $api = Api::leftJoin("methods", "methods.id", "apis.method_id")->select(['apis.*', 'methods.title as method'])->where("apis.id", $id)->first();
        $api->purpose = ApiPurpose::find($api->type)->title;
        $api->data_repository = DataRepository::find($api->data_repository_id);
        $api->settings = ApiSetting::where("api_id", $api->id)->first();

        // Prepare Api Details
        $api->headers = $this->headerService->prepareForModify($api->id);
        $api->parameters = $this->parameterService->prepareForModify($api->id);
        $api->body = $this->bodyService->prepareForModify($api->id, $api->body_type_id);

        $api->url = $this->apiPreparationService->returnBaseURL() . $api->end_point;

        $api->authorization_key = null;
        if ($api->is_authenticated) {
            $authorizationKey =  $api->headers->map(function ($header) use ($api) {
                if ($header['key']['label'] == "Authorization") {
                    if ($header['value'] && !empty($header['value'])) {
                        return $header['value'];
                    } else {
                        return null;
                    }
                }
            });

            $api->authorization_key = $authorizationKey && count($authorizationKey) ? $authorizationKey[0] : null;
        }
        return $api;
    }

    public function store($request)
    {
        try {
            DB::beginTransaction();

            $api = Api::create($this->formatApiData($request));

            $this->saveHeaders($api->id, $request['headers']);
            $this->saveParameters($api->id, $request['parameters']);
            $this->saveBody($api->id, $request['body_type_id'], $request['body']);
            if (isset($request['settings'])) {
                $this->saveSettings($api->id, $request['settings']);
            }

            if (isset($request['response'])) {
                $this->saveResponse($api->id, $request['response']);
            }

            if (isset($request['mock_response'])) {
                $this->saveMockResponse($api->id, $request['mock_response']);
            }

            // retrieve data
            if ($request['purpose_id'] == 1 && isset($request['data_repository_id'])) {
                $this->saveDataRepositoryResponse($api->id, $request['data_repository_id']);
            }

            $this->saveVersion($api->id);

            DB::commit();
            return ['success' => true, 'api' => $api];
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception($e->getMessage() . " L" . $e->getLine());
        }
    }

    public function update($id, $request)
    {
        try {
            DB::beginTransaction();

            $api = Api::findOrFail($id);
            $api->update($this->formatApiData($request));

            $this->updateHeaders($api->id, $request['headers']);
            $this->updateParameters($api->id, $request['parameters']);
            $this->updateBody($api->id, $request['body_type_id'], $request['body']);
            $this->updateSettings($api->id, $request['settings']);

            DB::commit();
            return ['success' => true, 'api' => $api];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['success' => false, 'message' => $e->getMessage() . " L" . $e->getLine()];
        }
    }

    private function formatApiData($request)
    {
        return [
            'title' => $request['title'],
            'description' => $request['description'],
            'type' => $request['purpose_id'],
            'service' => $request['service'] ?? ApiServices::API,
            'template_id' => $request['template_id'] ?? null,
            'data_repository_id' => $request['data_repository_id'] ?? null,
            'end_point' => $request['end_point'],
            'method_id' => $request['method_id'],
            'body_type_id' => $request['body_type_id'],
            'is_authenticated' => $this->checkAuthenticatedHeader($request),
        ];
    }

    private function checkAuthenticatedHeader($request)
    {
        foreach ($request['headers'] as $header) {
            if (isset($header['key']['label']) && $header['key']['label'] == 'Authorization') {
                return true;
            }
        }
        return false;
    }

    private function saveHeaders($apiId, $headers)
    {
        $this->headerService->store($apiId, $headers);
    }

    private function saveParameters($apiId, $parameters)
    {
        $this->parameterService->store($apiId, $parameters);
    }

    private function saveBody($apiId, $type, $body)
    {
        $this->bodyService->store($apiId, $type, $body);
    }

    private function saveDataRepositoryResponse($apiId, $dataRepositoryId)
    {
        $keys = DataRepositoryKey::where("data_repository_id", $dataRepositoryId)->get();

        foreach ($keys as $key) {
            if ($key['data_repository_key'] && $key['data_repository_key'] != '') {
                ApiResponse::create([
                    'api_id' => $apiId,
                    'response_key' => $key['data_repository_key'],
                    'data_type_id' => $key['data_type_id'],
                ]);
            }
        }
    }

    private function saveResponse($apiId, $responses)
    {
        foreach ($responses as $response) {
            if ($response['key'] && $response['key'] != '') {
                ApiResponse::create([
                    'api_id' => $apiId,
                    'response_key' => $response['key'],
                    'response_value' => $response['value'],
                    'data_type_id' => DataTypes::STRING,
                ]);
            }
        }
    }

    private function saveMockResponse($apiId, $responses)
    {
        foreach ($responses as $key => $value) {
            if (isset($key) && isset($value) && $key != null) {
                ApiResponse::create([
                    'api_id' => $apiId,
                    'response_key' => $key,
                    'response_value' => $value,
                    'data_type_id' => DataTypes::STRING,
                ]);
            }
        }
    }

    private function saveSettings($apiId, $settings)
    {
        if ($settings) {
            ApiSetting::create([
                'api_id' => $apiId,
                'allow_counter' => isset($settings['allow_counter']) ? $settings['allow_counter'] : false,
                'allow_paginator' => isset($settings['allow_paginator']) ? $settings['allow_paginator'] : false,
            ]);
        }
    }

    private function updateHeaders($apiId, $headers)
    {
        ApiHeader::where('api_id', $apiId)->delete();
        $this->saveHeaders($apiId, $headers);
    }

    private function updateParameters($apiId, $parameters)
    {
        ApiParameter::where('api_id', $apiId)->delete();
        $this->saveParameters($apiId, $parameters);
    }

    private function updateBody($apiId, $type, $body)
    {
        ApiBody::where('api_id', $apiId)->delete();
        $this->saveBody($apiId, $type, $body);
    }

    private function updateSettings($apiId, $settings)
    {
        $setting = ApiSetting::where('api_id', $apiId)->first();
        if ($setting) {
            $setting->update($settings);
        } else {
            $this->saveSettings($apiId, $settings);
        }
    }

    private function saveVersion($apiId)
    {
        $lastVersion = ApiVersion::select('version_number')->where("api_id", $apiId)->latest()->first();

        $newVersionNumber = '1.0';
        if ($lastVersion) {
            $lastVersionNumber = $lastVersion->version_number;
            $parts = explode('.', $lastVersionNumber);
            $major = (int)$parts[0];
            $minor = (int)$parts[1];

            if ($minor < 9) {
                $minor++;
            } else {
                $major++;
                $minor = 0;
            }

            $newVersionNumber = $major . '.' . $minor;
        }
        return ApiVersion::create(['api_id' => $apiId, 'version_number' => $newVersionNumber]);
    }

    /**
     * Return postman json for importing to postman
     *
     * @param integer $id
     * @return JsonResponse
     */
    public function export(int $id): JsonResponse
    {
        $api = $this->prepare($id);
        return $this->postmanService->export($api);
    }

    /**
     * Return postman json of collection
     *
     * @param integer $id
     * @return JsonResponse
     */
    public function exportCollection(array $ids): JsonResponse
    {
        $apis = [];
        foreach ($ids as $id) {
            $apis[] = $this->prepare($id);
        }

        return $this->postmanService->collection($apis);
    }

    public function prepareResponses(Api $api, $key = null)
    {
        return $key ? ApiResponse::where("api_id", $api->id)->where("response_key", $key)->first()
            : ApiResponse::where("api_id", $api->id)->get();
    }

    public function storeCopilot(Request $request)
    {
        $apiConfig = json_decode(json_encode($request->api_configuration), true);

        // Save Data Repository If Exists
        if ($request->data_repository && count($request->data_repository)) {
            $dataRepository = DataRepository::create([
                'title' => $apiConfig['title'] . " Repository",
                'description' => $apiConfig['title'] . " Repository",
            ]);
            $dataRepositoryValues['data'] = $request->data_repository;
            $this->dataRepositoryService->sync($dataRepository->id, $dataRepositoryValues);

            $apiConfig['data_repository_id'] = $dataRepository->id;
        }

        $apiConfig['service'] = ApiServices::API;

        return $this->store($apiConfig);
    }
}
