<?php

namespace Modules\Template\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use Modules\Template\Entities\Template;
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
        $Templates = Template::whereIsCloud($request->is_cloud ?? true)->orderBy("title")->get();
        return $this->return(200, 'Templates fetched successfully', ['data' => $Templates]);
    }

    public function show(string $slug)
    {
        $template = Template::whereSlug($slug)->first();
        $template->sample = $this->templateService->sample($template);
        return $this->return(200, 'Template fetched successfully', ['template' => $template]);
    }
}
