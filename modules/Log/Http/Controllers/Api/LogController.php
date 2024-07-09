<?php

namespace Modules\Log\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Log\Entities\Log;

class LogController extends ApiController {
    public function index(Request $request): JsonResponse {
        $logs = Log::orderByDesc('created_at')->where("internal", false)->paginate(25);
        return $this->return(200, "Logs Fetched Successfully", ['logs' => $logs]);
    }

    public function show(string $id): JsonResponse {
        $log = Log::where("_id", $id)->first();
        return $this->return(200, "Log Fetched Successfully", ['log' => $log]);
    }
}
    