<?php

namespace Modules\Api\Services\Api;

use App\Constants\DataTypes;
use Modules\Api\Entities\ApiHeader;

class HeaderService
{
    public function store($apiId, $headers)
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

    public function prepareForModify($apiId) {
        
    }

}
