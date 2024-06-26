<?php

namespace Modules\GPT\Http\Controllers;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Modules\GPT\Http\Requests\GenerateRequest;
use Modules\GPT\Services\GPTService;

class GPTController extends ApiController
{
    protected $gptService;

    public function __construct(GPTService $gptService)
    {
        $this->gptService = $gptService;
    }

    public function generate(GenerateRequest $generateRequest): JsonResponse
    {
        $validatedData = $generateRequest->validated();
        $response = $this->gptService->generate($validatedData['type'], $validatedData['text']);
        return $this->return(200, "Response fetched successfully", ['response' => $response]);
    }
}
