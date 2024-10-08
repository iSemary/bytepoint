<?php

namespace Modules\Api\Http\Controllers;

use App\Constants\ApiServices;
use App\Http\Controllers\Api\ApiController as ApiControllerHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Modules\Api\Entities\Api;
use Modules\Api\Entities\ApiPurpose;
use Modules\Api\Http\Requests\StoreApiRequest;
use Modules\Api\Http\Requests\UpdateApiRequest;
use Modules\Api\Services\ApiService;
use Modules\Api\Services\ExternalApiService;
use Modules\Api\Services\ApiPreparationService;
use Modules\DataRepository\Entities\DataRepository;

class ApiController extends ApiControllerHandler
{
    private $apiService;
    private $externalApiService;
    private $apiPreparationService;

    public function __construct(ApiService $apiService, ExternalApiService $externalApiService, ApiPreparationService $apiPreparationService)
    {
        $this->apiService = $apiService;
        $this->externalApiService = $externalApiService;
        $this->apiPreparationService = $apiPreparationService;
    }

    /**
     * Fetch all apis
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $apis = Api::withTrashed()
            ->leftJoin("methods", "methods.id", "apis.method_id")
            ->select(['apis.*', 'methods.title as method'])
            ->orderByDesc('id')->paginate(25);

        foreach ($apis as $api) {
            $api->type = ApiPurpose::find($api->type)->title;
            $api->service = ApiServices::getTitle($api->service);
            $api->data_repository_title = DataRepository::withTrashed()->find($api->data_repository_id)?->title;
        }

        return $this->return(200, "Apis Fetched Successfully", ['apis' => $apis]);
    }

    /**
     * Show the specified Api
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $api = $this->prepareAPIResponse($id);
        $api->service = ApiServices::getTitle($api->service);
        return $this->return(200, "Api Fetched Successfully", ['api' => $api]);
    }

    /**
     * Store the Api
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(StoreApiRequest $storeApiRequest): JsonResponse
    {
        // Validate the incoming request
        $validatedData = $storeApiRequest->validated();
        $validatedData['service'] = ApiServices::API;
        $result = $this->apiService->store($validatedData);

        if ($result['success']) {
            return $this->return(200, "Api Stored Successfully", ['api' => $result['api']]);
        }

        return $this->return(400, "Api Store Failed", ['message' => $result['message']]);
    }

    /**
     * Update the existing Api
     *
     * @param integer $id
     * @param Request $request
     * @return JsonResponse
     */
    public function update(int $id, UpdateApiRequest $updateApiRequest): JsonResponse
    {
        // Validate the incoming request
        $validatedData = $updateApiRequest->validated();
        $result = $this->apiService->update($id, $validatedData);

        if ($result['success']) {
            return $this->return(200, "Api Updated Successfully", ['api' => $result['api']]);
        }

        return $this->return(400, "Api Update Failed", debug: ['message' => $result['message']]);
    }

    /**
     * Remove the specified Api.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $api = Api::findOrFail($id);
        $api->delete();

        return $this->return(200, "Api Deleted Successfully");
    }

    /**
     * Restore the specified Api.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function restore(int $id): JsonResponse
    {
        $api = Api::withTrashed()->findOrFail($id);

        if ($api->trashed()) {
            $api->restore();

            return $this->return(200, "Api Restored Successfully");
        }

        return $this->return(404, "Api not found or not soft deleted");
    }

    /**
     * Prepare API objects for creation
     *
     * @return JsonResponse
     */
    public function prepare(): JsonResponse
    {
        $apiPreparation = $this->apiPreparationService->returnPreparation();
        return $this->return(200, "Api Preparation Fetched Successfully", ['data' => $apiPreparation]);
    }

    /**
     * Return sample of the API
     *
     * @param integer $id
     * @return JsonResponse
     */
    public function sample(int $id): JsonResponse
    {
        $api = $this->prepareAPIResponse($id);
        $api->service = ApiServices::getTitle($api->service);
        return $this->return(200, "Api Sample Fetched Successfully", ['api' => $api]);
    }

    /**
     * Prepare API Response
     *
     * @param integer $id
     * @return Api
     */
    private function prepareAPIResponse(int $id)
    {
        return $this->apiService->prepare($id);
    }

    /**
     * Export API
     *
     * @param integer $id
     * @return void
     */
    public function export(int $id)
    {
        return $this->apiService->export($id);
    }

    /**
     * Export Collection of multiple API
     *
     * @param Request $request
     * @return void
     */
    public function exportCollection(Request $request)
    {
        $collection = $this->apiService->exportCollection($request->ids);
        return $this->return(200, 'Collection generated successfully', ['name' => date('Y-m-d-H_i_s'), 'collection' => $collection]);
    }

    /**
     * Test & Run The API
     *
     * @param integer $id
     * @param Request $request
     * @return void
     */
    public function run(int $id, Request $request)
    {
        return $this->externalApiService->run($id, $request);
    }

    /**
     * Undocumented function
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function copilotStore(Request $request)
    {
        $result = $this->apiService->storeCopilot($request);

        if ($result['success']) {
            return $this->return(200, "Api Stored Successfully", ['api' => $result['api']]);
        }

        return $this->return(400, "Api Store Failed", ['message' => $result['message']]);
    }
}
