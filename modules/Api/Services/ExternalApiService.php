<?php

namespace Modules\Api\Services;

use Modules\Api\Entities\Api;
use Illuminate\Http\Request;

class ExternalApiService
{
    protected $api = Api::class;
    protected $apiService;

    public function __construct(ApiService $apiService) {
        $this->apiService = $apiService;
    }

    public function run(int $id, Request $request){
        $this->apiService->prepare($id);
    }
}
