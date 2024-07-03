<?php

namespace Modules\Api\Services\Api;

use App\Constants\DataTypes;
use Modules\Api\Entities\ApiParameter;

class ParameterService
{
    public function store($apiId, $parameters)
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

    public function prepareForModify($apiId)
    {
        return ApiParameter::select(['id', 'data_type_id', 'parameter_key AS key', 'parameter_value AS value'])->where('api_id', $apiId)->get();
    }
}
