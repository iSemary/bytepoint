<?php

namespace Modules\Template\Services;

use App\Constants\ApiServices;
use App\Constants\DataTypes;
use Modules\Api\Entities\ApiPurpose;
use Modules\Api\Entities\BodyType;
use Modules\Api\Entities\Method;
use Modules\Api\Services\ApiService;
use Modules\DataRepository\Entities\DataRepository;
use Modules\DataRepository\Services\DataRepositoryService;
use Modules\Template\Entities\Template;

class TemplateService
{
    protected $templateSampleService;
    protected $apiService;
    protected $dataRepositoryService;

    public function __construct(TemplateSampleService $templateSampleService, ApiService $apiService, DataRepositoryService $dataRepositoryService)
    {
        $this->templateSampleService = $templateSampleService;
        $this->apiService = $apiService;
        $this->dataRepositoryService = $dataRepositoryService;
    }

    public function sample(Template $template)
    {
        return $this->templateSampleService->generate($template);
    }

    public function store($id, $request)
    {
        $dataRepository = DataRepository::create([
            'title' => $request['data_repository_title'],
            'description' => $request['data_repository_description'],
        ]);

        $template = Template::findOrFail($id);

        $dataRepositoryKeys = $this->prepareDataRepositoryKeysTemplate($template);
        $this->dataRepositoryService->sync($dataRepository->id, $dataRepositoryKeys);

        $request['template_id'] = $template->id;
        $request['data_repository_id'] = $dataRepository->id;
        $data = $this->prepareApiTemplate($template, $request);
        $api = $this->apiService->store($data);
        return $api;
    }

    private function prepareApiTemplate(Template $template, $request)
    {
        $api = [];
        $api['title'] = $request['api_title'];
        $api['description'] = $request['api_description'];
        $api['end_point'] = $request['end_point'];
        $api['data_repository_id'] = $request['data_repository_id'];
        $api['template_id'] = $request['template_id'];


        switch ($template->type) {
            case 'fetch_paginated_data':
                $api['purpose_id'] = ApiPurpose::whereType("retrieve")->first()->id;
                $api['method_id'] = Method::whereTitle("GET")->first()->id;
                $api['body_type_id'] = BodyType::whereTitle('multipart/form-data')->first()->id;

                $api['parameters']['key'] = "page";
                $api['parameters']['value'] = 1;
                $api['parameters']['key'] = "per_page";
                $api['parameters']['value'] = 10;
                $api['parameters']['key'] = "sort_by";
                $api['parameters']['value'] = "created_at";
                $api['parameters']['key'] = "order";
                $api['parameters']['value'] = "desc";

                $api['headers'] = [];
                $api['body'] = [];

                break;
            case 'contact_us':
                $api['purpose_id'] = ApiPurpose::whereType("store")->first()->id;
                $api['method_id'] = Method::whereTitle("POST")->first()->id;
                $api['body_type_id'] = BodyType::whereTitle('multipart/form-data')->first()->id;

                $api['parameters'] = [];
                $api['headers'] = [];
                $api['body'][0]['key'] = 'name';
                $api['body'][0]['value'] = 'Your name';
                $api['body'][1]['key'] = 'email';
                $api['body'][1]['value'] = 'Your email address';
                $api['body'][2]['key'] = 'message';
                $api['body'][2]['value'] = 'Your message';

                $api['response'][0]['key'] = 'message';
                $api['response'][0]['value'] = 'You have successfully subscribed to the newsletter!';
                
                break;
            case 'newsletter':
                $api['purpose_id'] = ApiPurpose::whereType("store")->first()->id;
                $api['method_id'] = Method::whereTitle("POST")->first()->id;
                $api['body_type_id'] = BodyType::whereTitle('multipart/form-data')->first()->id;

                $api['parameters'] = [];
                $api['headers'] = [];
                $api['body'][0]['key'] = 'email';
                $api['body'][0]['value'] = 'Your email address';

                $api['response'][0]['key'] = 'message';
                $api['response'][0]['value'] = 'You have successfully subscribed to the newsletter!';

                break;
            case 'ip_to_location':
                $api['purpose_id'] = ApiPurpose::whereType("store")->first()->id;
                $api['method_id'] = Method::whereTitle("POST")->first()->id;
                $api['body_type_id'] = BodyType::whereTitle('multipart/form-data')->first()->id;

                $api['parameters'] = [];
                $api['headers'] = [];
                $api['body'][0]['key'] = 'ip';
                $api['body'][0]['value'] = '127.0.0.1';

                break;
            case 'ocr':
                $api['purpose_id'] = ApiPurpose::whereType("store")->first()->id;
                $api['method_id'] = Method::whereTitle("POST")->first()->id;
                $api['body_type_id'] = BodyType::whereTitle('multipart/form-data')->first()->id;

                $api['parameters'] = [];
                $api['headers'] = [];
                $api['body'] = [];
                $api['body'][0]['key'] = 'image';
                $api['body'][0]['value'] = 'FILE';
                break;
            default:
                break;
        }
        // Save the type of the API service
        $api['service'] = ApiServices::Template;
        if ($template->is_cloud) {
            $api['service'] = ApiServices::CloudService;
        }

        return $api;
    }

    private function prepareDataRepositoryKeysTemplate(Template $template)
    {
        $formattedKeys = [];
        $keys = [];
        switch ($template->type) {
            case 'fetch_paginated_data':
                $keys = [
                    'id',
                    'title',
                    'description'
                ];
                break;
            case 'contact_us':
                $keys = [
                    'name',
                    'email',
                    'message',
                ];
                break;
            case 'newsletter':
                $keys = [
                    'email'
                ];
                break;
            case 'ip_to_location':
                $keys = [
                    'ip',
                    'country',
                    'region',
                    'city',
                ];
                break;
            case 'ocr':
                $keys = [
                    'image_path',
                    'text'
                ];
                break;
            default:
                break;
        }

        foreach ($keys as $i => $key) {
            $formattedKeys['data'][$i]['key'] = $key;
            $formattedKeys['data'][$i]['type'] = DataTypes::STRING;
            $formattedKeys['data'][$i]['values'] = [];
        }

        return $formattedKeys;
    }
}
