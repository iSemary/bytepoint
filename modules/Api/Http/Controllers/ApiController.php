<?php

namespace Modules\Api\Http\Controllers;

use App\Http\Controllers\Api\ApiController as ApiControllerHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Modules\Api\Entities\Api;
use Modules\Api\Http\Requests\StoreApiRequest;
use Modules\Api\Http\Requests\UpdateApiRequest;

class ApiController extends ApiControllerHandler
{

    public function __construct() {
    }

    /**
     * Fetch all apis
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse {
        $apis = Api::paginate(10);
        return $this->return(200, "Apis Fetched Successfully", ['apis' => $apis]);
    }

    /**
     * Show the specified Api
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse {
        $api = Api::where("id", $id)->first();
        return $this->return(200, "Api Fetched Successfully", ['api' => $api]);
    }

    /**
     * Store the Api
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(StoreApiRequest $storeApiRequest): JsonResponse {
        // Validate the incoming request
        $validatedData = $storeApiRequest->validated();
        $api = Api::create($validatedData);
        return $this->return(200, "Api Stored Successfully", ['api' => $api]);
    }

    /**
     * Update the existing Api
     *
     * @param integer $id
     * @param Request $request
     * @return JsonResponse
     */
    public function update(int $id, UpdateApiRequest $updateApiRequest): JsonResponse {
        // Validate the incoming request
        $validatedData = $updateApiRequest->validated();

        $api = Api::findOrFail($id);
        $api->update($validatedData);

        return $this->return(200, "Api Updated Successfully", ['api' => $api]);
    }

    /**
     * Remove the specified Api.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse {
        $dataRepository = Api::findOrFail($id);
        $dataRepository->delete();

        return $this->return(200, "Api Deleted Successfully");
    }

    /**
     * Restore the specified Api.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function restore(int $id): JsonResponse {
        $dataRepository = Api::withTrashed()->findOrFail($id);

        if ($dataRepository->trashed()) {
            $dataRepository->restore();

            return $this->return(200, "Api Restored Successfully");
        }

        return $this->return(404, "Api not found or not soft deleted");
    }

}
