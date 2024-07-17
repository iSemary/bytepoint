<?php

namespace Modules\Mockup\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Api\Entities\Api;
use Modules\Api\Services\ApiPreparationService;
use Modules\Mockup\Entities\Mockup;
use Modules\Mockup\Http\Requests\StoreMockupRequest;
use Modules\Mockup\Services\MockupService;
use Modules\Tenant\Helper\TenantHelper;

class MockupController extends ApiController
{
    protected $mockupService;
    protected $apiPreparationService;

    public function __construct(MockupService $mockupService, ApiPreparationService $apiPreparationService)
    {
        $this->mockupService = $mockupService;
        $this->apiPreparationService = $apiPreparationService;
    }

    /**
     * Fetch all mockup apis
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $mockups = Mockup::withTrashed()->orderByDesc('id')->paginate(25);
        $baseURL = $this->apiPreparationService->returnBaseURL();
        foreach ($mockups as $mockup) {
            $mockup->base_end_point = Api::withTrashed()->whereId($mockup->base_api_id)->first()->end_point;
            $mockup->mock_end_point = $baseURL . Api::withTrashed()->whereId($mockup->mocked_api_id)->first()->end_point;
        }
        return $this->return(200, "Mockup Fetched Successfully", ['mockups' => $mockups]);
    }

    /**
     * Store the mock up
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(StoreMockupRequest $storeMockupRequest): JsonResponse
    {
        $validatedData = $storeMockupRequest->validated();
        $result = $this->mockupService->store($validatedData);

        if ($result['success']) {
            return $this->return(200, "Mockup Stored Successfully", ['mockup' => $result['mockup']]);
        }
        return $this->return(400, "Mockup Store Failed", ['message' => $result['message']]);
    }

    /**
     * Remove the specified Mockup.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $mockup = Mockup::findOrFail($id);
        $mockup->delete();

        return $this->return(200, "Mockup Deleted Successfully");
    }

    /**
     * Restore the specified Mockup.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function restore(int $id): JsonResponse
    {
        $mockup = Mockup::withTrashed()->findOrFail($id);

        if ($mockup->trashed()) {
            $mockup->restore();

            return $this->return(200, "Mockup Restored Successfully");
        }

        return $this->return(404, "Mockup not found or not soft deleted");
    }

    /**
     * Return the Base API response
     *
     * @param Request $request
     * @return void
     */
    public function run(Request $request)
    {
        $response = $this->mockupService->run($request);
        return $this->return(200, "Base API response fetched", ['response' => $response]);
    }
}
