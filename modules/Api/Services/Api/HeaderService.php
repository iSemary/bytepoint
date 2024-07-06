<?php

namespace Modules\Api\Services\Api;

use App\Constants\DataTypes;
use Modules\Api\Entities\ApiHeader;
use Modules\Api\Entities\Header;

class HeaderService
{
    public function store($apiId, $headers)
    {
        foreach ($headers as $header) {
            if (isset($header['key']['label']) && !empty($header['key']['label']) && !empty($header['key']['value']) && isset($header['value']) && !empty($header['value'])) {
                Header::updateOrCreate(
                    ['title' => $header['key']['label']],
                    ['title' => $header['key']['label'], 'description' => "Used in API #" . $apiId]
                );

                ApiHeader::create([
                    'api_id' => $apiId,
                    'data_type_id' => DataTypes::STRING,
                    'header_key' => $header['key']['label'],
                    'header_value' => $header['value'],
                ]);
            }
        }
    }

    public function prepareForModify($apiId)
    {
        return ApiHeader::leftJoin('headers', 'headers.title', 'api_headers.header_key')
            ->select(['api_headers.id', 'headers.id as header_id', 'data_type_id', 'header_key AS key', 'header_value AS value'])
            ->groupBy("api_headers.id")
            ->where('api_id', $apiId)->get()->map(function ($header) {
                return [
                    'id' => $header->id,
                    'data_type_id' => $header->data_type_id,
                    'key' => [
                        'label' => $header->key,
                        'value' => $header->header_id
                    ],
                    'value' => $header->value
                ];
            });
    }
}
