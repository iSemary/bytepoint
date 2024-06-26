<?php

namespace Modules\GPT\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Modules\GPT\Entities\Prompt;
use OpenAI\Laravel\Facades\OpenAI;

class GPTService
{
    public function generate(int $type, string $text)
    {
        try {
            $systemPrompt = $this->prepareSystemPrompt($type);
            $result = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $text],
                ],
            ]);

            if (isset($result->choices[0]->message->content)) {
                return $result->choices[0]->message->content;
            } else {
                throw new Exception('No content found in response ' . json_encode($result));
            }
        } catch (Exception $e) {
            Log::error('GPTService generate error: ' . $e->getMessage());
            return $e->getMessage();
        }
    }

    private function prepareSystemPrompt($type)
    {
        $prompt = Prompt::select('body')->whereType($type)->first();

        if (!$prompt) {
            throw new Exception('Prompt not found');
        }
        return $prompt->body;
    }
}
