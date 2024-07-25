<?php

namespace Modules\Api\Services\Api;

use App\Constants\DataTypes;
use Modules\Api\Entities\ApiAuthentication;
use Modules\Api\Entities\ApiHeader;
use Modules\Api\Entities\Header;
use Illuminate\Support\Collection;

class HeaderService
{
    public function store($apiId, array $headers): void
    {
        foreach ($headers as $header) {
            if ($this->isValidRegularHeader($header)) {
                $this->storeRegularHeader($apiId, $header);
            } elseif ($this->isValidAuthorizationHeader($header)) {
                $this->storeAuthorizationHeader($apiId, $header);
            }
        }
    }

    private function isValidRegularHeader(array $header): bool
    {
        return isset($header['key']['label']) &&
            !empty($header['key']['label']) &&
            !empty($header['key']['value']) &&
            isset($header['value']) &&
            !empty($header['value']);
    }

    private function isValidAuthorizationHeader(array $header): bool
    {
        return isset($header['key']['label']) &&
            isset($header['authorization_id']) &&
            is_numeric($header['authorization_id']);
    }

    private function storeRegularHeader($apiId, array $header): void
    {
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

    private function storeAuthorizationHeader($apiId, array $header): void
    {
        ApiHeader::create([
            'api_id' => $apiId,
            'data_type_id' => DataTypes::STRING,
            'header_key' => $header['key']['label'],
            'header_value' => "",
        ]);

        ApiAuthentication::create([
            'api_id' => $apiId,
            'type' => 'key',
            'key_id' => $header['authorization_id'],
        ]);
    }

    public function prepareForModify($apiId): Collection
    {
        return ApiHeader::leftJoin('headers', 'headers.title', 'api_headers.header_key')
            ->select(['api_headers.id', 'headers.id as header_id', 'data_type_id', 'header_key AS key', 'header_value AS value'])
            ->groupBy("api_headers.id")
            ->where('api_id', $apiId)
            ->get()
            ->map(function ($header) use ($apiId) {
                return $this->formatHeader($header, $apiId);
            });
    }

    private function formatHeader($header, $apiId): array
    {
        $apiAuthenticationId = $this->getApiAuthenticationId($header, $apiId);

        return [
            'id' => $header->id,
            'data_type_id' => $header->data_type_id,
            'key' => [
                'label' => $header->key,
                'value' => $header->header_id
            ],
            'value' => $header->value,
            'authorization_id' => $apiAuthenticationId,
        ];
    }

    private function getApiAuthenticationId($header, $apiId): ?int
    {
        if ($header->key == "Authorization") {
            $apiAuth = ApiAuthentication::where("api_id", $apiId)->first();
            return $apiAuth ? $apiAuth->key_id : null;
        }
        return null;
    }
}
