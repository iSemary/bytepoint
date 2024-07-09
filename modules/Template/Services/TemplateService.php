<?php

namespace Modules\Template\Services;

use Modules\Template\Entities\Template;

class TemplateService
{
    protected $templateSampleService;

    public function __construct(TemplateSampleService $templateSampleService)
    {
        $this->templateSampleService = $templateSampleService;    
    }

    public function sample(Template $template) {
        return $this->templateSampleService->generate($template);
    }
}
