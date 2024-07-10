<?php

namespace Modules\Mockup\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use Modules\Mockup\Services\MockupService;

class MockupController extends ApiController
{
    protected $mockupService;

    public function __construct(MockupService $mockupService)
    {
        $this->mockupService = $mockupService;
    }

    public function index()
    {
    }

    public function run(Request $request)
    {
        $response = $this->mockupService->run($request);
        return $this->return(200, "Base API response fetched", ['response' => $response]);
    }
}
