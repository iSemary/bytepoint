<?php

namespace Modules\Key\Http\Controllers;

use App\Http\Controllers\Api\ApiController;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Key\Entities\Key;
use Modules\Key\Http\Requests\StoreKeyRequest;
use Modules\Key\Services\KeyService;

class KeyController extends ApiController
{
    protected $keyService;

    public function __construct(KeyService $keyService)
    {
        $this->keyService = $keyService;
    }

    /**
     * Fetch all keys
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index()
    {
        $keys = Key::withTrashed()->select(['id', 'title', 'expire_at', 'last_used_at', 'created_at', 'deleted_at'])->orderByDesc('keys.id')->paginate(25);
        foreach ($keys as $key) {
            $key->expire_at_diff = $key->expire_at ?  Carbon::createFromTimestamp($key->expire_at)->diffForHumans() : "Permanent";
        }
        return $this->return(200, "Keys Fetched Successfully", ['keys' => $keys]);
    }

    public function all()
    {
        $keys = Key::withTrashed()->select(['id', 'title'])->orderByDesc('keys.id')->get();
        return $this->return(200, "Keys Fetched Successfully", ['keys' => $keys]);
    }

    /**
     * Store the Key
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(StoreKeyRequest $storeKeyRequest): JsonResponse
    {
        // Validate the incoming request
        $validatedData = $storeKeyRequest->validated();
        $result = $this->keyService->store($validatedData);

        if ($result['success']) {
            return $this->return(200, "Key Stored Successfully");
        }

        return $this->return(400, "Key Store Failed", ['message' => $result['message']]);
    }

    /**
     * Remove the specified key.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $key = Key::findOrFail($id);
        $key->delete();

        return $this->return(200, "Key Deleted Successfully");
    }
}
