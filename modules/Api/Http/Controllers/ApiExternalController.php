<?php

namespace Modules\Api\Http\Controllers;

use App\Http\Controllers\Api\ApiController;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Api\Entities\Api;
use Modules\Api\Services\ExternalApiService;

class ApiExternalController extends ApiController
{
    protected $externalApiService;

    public function __construct(ExternalApiService $externalApiService)
    {
        $this->externalApiService = $externalApiService;
    }

    public function handler(Request $request, string $path, string $id = null): JsonResponse
    {
        $api = Api::where("end_point", $path)->first();
        if (!$api) {
            throw new Exception("API has been expired or not found");
        }
        return $this->externalApiService->run($api->id, $request);
    }
}
