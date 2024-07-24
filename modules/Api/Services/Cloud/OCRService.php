<?php

namespace Modules\Api\Services\Cloud;

use Illuminate\Http\Request;
use Modules\Api\Entities\Api;
use Modules\DataRepository\Entities\DataRepositoryKey;
use Modules\DataRepository\Entities\DataRepositoryValue;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Aws\Textract\TextractClient;
use Spatie\Multitenancy\Models\Tenant;

class OCRService
{
    private $api;
    private $request;

    public function process(Api $api, Request $request): array
    {
        $this->api = $api;
        $this->request = $request;

        $imagePath = $this->saveImageLocally();
        $this->storeImagePath($imagePath);
        $extractedText = $this->extractTextFromImage($imagePath);
        $this->storeText($extractedText);
        return ['text' => $extractedText];
    }

    private function saveImageLocally(): string
    {
        $image = $this->request->file('image');
        $guid = Str::uuid()->toString();
        $extension = $image->getClientOriginalExtension();
        $filename = $guid . '.' . $extension;
        $directory = 'tenants/' . (Tenant::current()->name) . '/ocr_images';

        $image->storeAs($directory, $filename, 'public');
        $baseUrl = config('app.url');
        $storagePath = Storage::url($directory . '/' . $filename);
        return  $baseUrl . $storagePath;
    }

    private function extractTextFromImage(string $imagePath): string
    {
        $textractClient = new TextractClient([
            'version' => 'latest',
            'region'  => env('AWS_DEFAULT_REGION'),
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
        ]);

        $result = $textractClient->detectDocumentText([
            'Document' => [
                'Bytes' => file_get_contents($imagePath),
            ],
        ]);

        $extractedText = '';
        foreach ($result['Blocks'] as $block) {
            if ($block['BlockType'] === 'LINE') {
                $extractedText .= $block['Text'] . "\n";
            }
        }

        return trim($extractedText);
    }

    private function storeImagePath(string $imagePath): void
    {
        $dataRepositoryKey = DataRepositoryKey::where("data_repository_id", $this->api->data_repository_id)->where('data_repository_key', "image_path")->first();

        DataRepositoryValue::create([
            'data_repository_key_id' => $dataRepositoryKey->id,
            'data_repository_value' => $imagePath
        ]);
    }

    private function storeText(string $text): void
    {
        $dataRepositoryKey = DataRepositoryKey::where("data_repository_id", $this->api->data_repository_id)->where('data_repository_key', "text")->first();

        DataRepositoryValue::create([
            'data_repository_key_id' => $dataRepositoryKey->id,
            'data_repository_value' => $text
        ]);
    }
}
