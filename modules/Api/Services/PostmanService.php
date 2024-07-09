<?php

namespace Modules\Api\Services;

use Illuminate\Http\JsonResponse;
use Modules\Api\Entities\Api;

class PostmanService
{
    public function collection(array $apis): JsonResponse
    {
        $postmanCollection = [
            'info' => [
                'name' => 'API Collection',
                'description' => 'Generated API collection',
                'schema' => 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
            ],
            'item' => $this->formatApis($apis)
        ];

        return response()->json($postmanCollection);
    }

    public function export(Api $api): JsonResponse
    {
        $postmanCollection = [
            'info' => [
                'name' => $api->title,
                'description' => $api->description,
                'schema' => 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
            ],
            'item' => $this->formatApi($api)
        ];

        return response()->json($postmanCollection);
    }

    private function formatApis(array $apis): array
    {
        return array_map([$this, 'formatApi'], $apis);
    }

    private function formatApi(Api $api): array
    {
        $item = [
            'name' => $api->title,
            'request' => [
                'method' => $api->method,
                'header' => $this->formatHeaders($api->headers),
                'url' => $this->formatUrl($api->url, $api->parameters),
            ]
        ];

        $formattedBody = $this->formatBody($api->body, $api->body_type_id);
        if (!empty($formattedBody)) {
            $item['request']['body'] = $formattedBody;
        }

        return $item;
    }

    private function formatHeaders($headers): array
    {
        return $headers->map(function ($header) {
            return [
                'key' => $header['key']['label'],
                'value' => $header['value'],
                'type' => 'text'
            ];
        })->toArray();
    }

    private function formatBody($body, $bodyTypeId): ?array
    {
        if (empty($body)) {
            return null;
        }

        $mode = $this->getBodyMode($bodyTypeId);
        $formattedBody = [
            'mode' => $mode,
        ];

        if ($mode === 'raw') {
            $formattedBody['raw'] = json_encode($this->formatRawBody($body));
            $formattedBody['options'] = [
                'raw' => [
                    'language' => 'json'
                ]
            ];
        } elseif ($mode === 'formdata' || $mode === 'urlencoded') {
            $formattedBody[$mode] = $this->formatFormBody($body);
        }

        return $formattedBody;
    }

    private function getBodyMode($bodyTypeId): string
    {
        $bodyTypeModes = [
            1 => 'raw',
            2 => 'formdata',
            3 => 'urlencoded',
        ];

        return $bodyTypeModes[$bodyTypeId] ?? 'raw';
    }

    private function formatRawBody($body): array
    {
        return $body->mapWithKeys(function ($item) {
            return [$item['key'] => $item['value']];
        })->toArray();
    }

    private function formatFormBody($body): array
    {
        return $body->map(function ($item) {
            return [
                'key' => $item['key'],
                'value' => $item['value'],
                'type' => 'text'
            ];
        })->toArray();
    }

    private function formatUrl($url, $parameters): array
    {
        $parsedUrl = parse_url($url);
        $formattedUrl = [
            'raw' => $url,
            'protocol' => $parsedUrl['scheme'] ?? 'http',
            'host' => explode('.', $parsedUrl['host']),
            'path' => explode('/', trim($parsedUrl['path'] ?? '', '/')),
        ];

        if (!empty($parameters)) {
            $formattedUrl['query'] = $parameters->map(function ($param) {
                return [
                    'key' => $param['key'],
                    'value' => $param['value']
                ];
            })->toArray();
        }

        return $formattedUrl;
    }
}
