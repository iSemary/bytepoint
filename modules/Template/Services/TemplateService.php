<?php

namespace Modules\Template\Services;

use Modules\Api\Services\ApiService;
use Modules\Template\Entities\Template;

class TemplateService
{
    protected $templateSampleService;
    protected $apiService;

    public function __construct(TemplateSampleService $templateSampleService, ApiService $apiService)
    {
        $this->templateSampleService = $templateSampleService;
        $this->apiService = $apiService;
    }

    public function sample(Template $template)
    {
        return $this->templateSampleService->generate($template);
    }

    public function store($id, $request)
    {
        $data = $this->prepareApiTemplate($id, $request);
        $api = $this->apiService->store($data);
        return $api;
    }

    private function prepareApiTemplate($id, $request)
    {
        $api = [];



        return $api;
    }
}
