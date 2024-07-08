<?php

namespace Modules\DataRepository\Http\Controllers;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\DataRepository\Entities\DataRepository;
use Modules\DataRepository\Http\Requests\StoreDataRepositoryRequest;
use Modules\DataRepository\Http\Requests\UpdateDataRepositoryRequest;
use Modules\DataRepository\Services\DataRepositoryService;

class DataRepositoryController extends ApiController
{
    protected $dataRepositoryService;

    public function __construct(DataRepositoryService $dataRepositoryService)
    {
        $this->dataRepositoryService = $dataRepositoryService;
    }

    /**
     * Fetch all data repositories
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $keyword = $request->input('keyword');
        $query = DataRepository::query();
        if ($keyword) {
            $query->where('title', 'like', '%' . $keyword . '%');
        }
        $dataRepositories = $query->orderByDesc("id")->paginate(25);
        return $this->return(200, "Data Repositories Fetched Successfully", ['data_repositories' => $dataRepositories]);
    }

    /**
     * Show the specified data repository
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $dataRepository = DataRepository::where("id", $id)->first();
        $dataRepositoryValues = $this->dataRepositoryService->get($id);
        return $this->return(200, "Data Repository Fetched Successfully", ['data_repository' => $dataRepository, 'data_repository_values' => $dataRepositoryValues]);
    }

    /**
     * Store the data repository
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(StoreDataRepositoryRequest $storeDataRepositoryRequest): JsonResponse
    {
        // Validate the incoming request
        $validatedData = $storeDataRepositoryRequest->validated();
        $dataRepository = DataRepository::create($validatedData);
        return $this->return(200, "Data Repository Stored Successfully", ['data_repository' => $dataRepository]);
    }

    /**
     * Update the existing data repository
     *
     * @param integer $id
     * @param Request $request
     * @return JsonResponse
     */
    public function update(int $id, UpdateDataRepositoryRequest $updateDataRepositoryRequest): JsonResponse
    {
        // Validate the incoming request
        $validatedData = $updateDataRepositoryRequest->validated();

        $dataRepository = DataRepository::findOrFail($id);
        $dataRepository->update($validatedData);

        return $this->return(200, "Data Repository Updated Successfully", ['data_repository' => $dataRepository]);
    }

    /**
     * Remove the specified data repository.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $dataRepository = DataRepository::findOrFail($id);
        $dataRepository->delete();

        return $this->return(200, "Data Repository Deleted Successfully");
    }

    /**
     * Restore the specified data repository.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function restore(int $id): JsonResponse
    {
        $dataRepository = DataRepository::withTrashed()->findOrFail($id);

        if ($dataRepository->trashed()) {
            $dataRepository->restore();

            return $this->return(200, "Data Repository Restored Successfully");
        }

        return $this->return(404, "Data Repository not found or not soft deleted");
    }

    /**
     * Sync keys and values of the specified data repository.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function fill(int $id, Request $request): JsonResponse
    {
        $dataRepository = DataRepository::withTrashed()->findOrFail($id);

        if ($dataRepository) {

            $this->dataRepositoryService->sync($id, $request);

            return $this->return(200, "Data Repository Filled Successfully");
        }

        return $this->return(404, "Data Repository not found or not soft deleted");
    }
}
