<?php

namespace Modules\Api\Services\Api;

use App\Constants\DataTypes;
use Modules\Api\Entities\ApiBody;

class BodyService
{
    public function store($apiId, $type, $body)
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

    public function prepareForModify($apiId)
    {
        return ApiBody::select(['id', 'data_type_id', 'body_key AS key', 'body_value AS value'])->where('api_id', $apiId)->get();
    }
}
