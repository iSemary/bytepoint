<?php

namespace Modules\Template\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use Modules\Template\Entities\Template;
use Modules\Template\Http\Requests\StoreTemplateRequest;
use Modules\Template\Services\TemplateService;

class TemplateController extends ApiController
{
    protected $templateService;

    public function __construct(TemplateService $templateService)
    {
        $this->templateService = $templateService;    
    }

    public function index(Request $request)
    {
        $templates = Template::whereIsCloud($request->is_cloud ?? true)->orderBy("title")->get();
        return $this->return(200, 'Templates fetched successfully', ['data' => $templates]);
    }

    public function show(string $slug)
    {
        $template = Template::whereSlug($slug)->first();
        $template->sample = $this->templateService->sample($template);
        return $this->return(200, 'Template fetched successfully', ['template' => $template]);
    }

    public function store(int $id, StoreTemplateRequest $storeTemplateRequest) {
        $validatedData = $storeTemplateRequest->validated();
        $api = $this->templateService->store($id, $validatedData);
        return $this->return(200, 'Api Template saved successfully', ['api' => $api['api']]);
    }
}
