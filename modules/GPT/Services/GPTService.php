<?php

namespace Modules\GPT\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Modules\GPT\Entities\Prompt;

class GPTService
{
    private string $apiKey;
    private string $apiUrl;
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('services.groq.api_key');
        $this->apiUrl = config('services.groq.api_url', 'https://api.groq.com/openai/v1/chat/completions');
        $this->model = config('services.groq.model', 'llama3-8b-8192');
    }

    public function generate(int $type, string $text): string
    {
        try {
            $systemPrompt = $this->getSystemPrompt($type);
            $response = $this->makeApiRequest($systemPrompt, $text);
            return $this->extractContentFromResponse($response);
        } catch (Exception $e) {
            Log::error('GPTService generate error: ' . $e->getMessage());
            return $e->getMessage();
        }
    }

    private function getSystemPrompt(int $type): string
    {
        $prompt = Prompt::whereType($type)->value('body');

        if (!$prompt) {
            throw new Exception("Prompt not found for type: $type");
        }

        return $prompt;
    }

    private function makeApiRequest(string $systemPrompt, string $userPrompt): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post($this->apiUrl, [
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userPrompt],
            ],
            'model' => $this->model,
        ]);

        if (!$response->successful()) {
            throw new Exception('API request failed: ' . $response->body());
        }

        return $response->json();
    }

    private function extractContentFromResponse(array $result): string
    {
        if (!isset($result['choices'][0]['message']['content'])) {
            throw new Exception('No content found in response: ' . json_encode($result));
        }

        return $result['choices'][0]['message']['content'];
    }
}