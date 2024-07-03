<?php

namespace Modules\Api\Http\Controllers;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Modules\Api\Entities\Api;

class ApiExternalController extends ApiController
{
    public function handler(string $path, string $id = null): JsonResponse
    {
        $api = Api::where("end_point", $path)->first();
        return $this->return(200, "API Fetched", ['api' => $api]);
    }
}
