<?php

namespace Modules\Api\Services;

use App\Constants\DataTypes;
use Illuminate\Support\Facades\DB;
use Modules\Api\Entities\Api;
use Modules\Api\Entities\ApiHeader;
use Modules\Api\Entities\ApiParameter;
use Modules\Api\Entities\ApiBody;
use Modules\Api\Entities\ApiResponse;
use Modules\Api\Entities\ApiSetting;
use Modules\Api\Entities\ApiVersion;
use Modules\DataRepository\Entities\DataRepositoryKey;

class ApiService
{
    public function store($request)
    {
        try {
            DB::beginTransaction();

            $api = Api::create($this->formatApiData($request));

            $this->saveHeaders($api->id, $request['headers']);
            $this->saveParameters($api->id, $request['parameters']);
            $this->saveBody($api->id, $request['body']);
            $this->saveSettings($api->id, $request['settings']);

            // retrieve data
            if ($request['purpose_id'] == 1) {
                $this->saveResponse($api->id, $request['data_repository_id']);
            }

            $this->saveVersion($api->id);

            DB::commit();
            return ['success' => true, 'api' => $api];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['success' => false, 'message' => $e->getMessage() . " L" . $e->getLine()];
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
            $this->updateBody($api->id, $request['body']);
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
            'data_repository_id' => $request['data_repository_id'],
            'end_point' => $request['end_point'],
            'method_id' => $request['method_id'],
            'body_type_id' => $request['body_type_id'],
            'is_authenticated' => $this->checkAuthenticatedHeader($request),
        ];
    }

    private function checkAuthenticatedHeader($request)
    {
        foreach ($request['headers'] as $header) {
            if (isset($header['key']['label']) && $header['key']['label'] == 'Authorization' && !empty($header['value'])) {
                return true;
            }
        }
        return false;
    }

    private function saveHeaders($apiId, $headers)
    {
        foreach ($headers as $header) {
            if (isset($header['key']['label']) && !empty($header['key']['label']) && !empty($header['key']['value'])) {
                ApiHeader::create([
                    'api_id' => $apiId,
                    'data_type_id' => DataTypes::STRING,
                    'header_key' => $header['key']['label'],
                    'header_value' => $header['value'],
                ]);
            }
        }
    }

    private function saveParameters($apiId, $parameters)
    {
        foreach ($parameters as $parameter) {
            if (isset($parameter['key']) && $parameter['value'] != '') {
                ApiParameter::create([
                    'api_id' => $apiId,
                    'data_type_id' => DataTypes::STRING,
                    'parameter_key' => $parameter['key'],
                    'parameter_value' => $parameter['value'],
                ]);
            }
        }
    }

    private function saveBody($apiId, $body)
    {
        foreach ($body as $item) {
            if (isset($item['key']) && $item['value'] != '') {
                ApiBody::create([
                    'api_id' => $apiId,
                    'data_type_id' => DataTypes::STRING,
                    'body_key' => $item['key'],
                    'body_value' => $item['value'],
                ]);
            }
        }
    }

    private function saveResponse($apiId, $dataRepositoryId)
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

    private function saveSettings($apiId, $settings)
    {
        ApiSetting::create([
            'api_id' => $apiId,
            'allow_counter' => $settings['allow_counter'],
            'allow_paginator' => $settings['allow_paginator'],
        ]);
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

    private function updateBody($apiId, $body)
    {
        ApiBody::where('api_id', $apiId)->delete();
        $this->saveBody($apiId, $body);
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
}
