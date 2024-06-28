<?php

namespace Modules\Api\Services;

use App\Models\DataType;
use Modules\Api\Entities\ApiPurpose;
use Modules\Api\Entities\BodyType;
use Modules\Api\Entities\ContentType;
use Modules\Api\Entities\Header;
use Modules\Api\Entities\Method;
use Modules\Tenant\Helper\TenantHelper;
use Spatie\Multitenancy\Models\Tenant;

class ApiPreparationService
{
    public function returnPreparation(): array
    {
        $data = [];
        $data['base_url'] = $this->returnBaseURL();
        $data['headers'] = $this->returnHeaders();
        $data['methods'] = $this->returnMethods();
        $data['data_types'] = $this->returnDataTypes();
        $data['body_types'] = $this->returnBodyTypes();
        $data['content_types'] = $this->returnContentTypes();
        $data['api_purposes'] = $this->returnApiPurposes();
        return $data;
    }

    private function returnHeaders()
    {
        return Header::select(['id', 'title', 'description'])->get();
    }

    private function returnMethods()
    {
        return Method::select(['id', 'title'])->get();
    }

    private function returnBodyTypes()
    {
        return BodyType::select(['id', 'title', 'description'])->get();
    }

    private function returnDataTypes()
    {
        return DataType::select(['id', 'title'])->get();
    }

    private function returnContentTypes()
    {
        return ContentType::select(['id', 'title'])->get();
    }

    private function returnApiPurposes()
    {
        return ApiPurpose::select(['id', 'title', 'description'])->get();
    }

    private function returnBaseURL()
    {
        $tenant = Tenant::current();
        $tenantURL = TenantHelper::generateURL($tenant->name);
        $baseURL = $tenantURL . config("settings.tenant_api_prefix"); 
        return $baseURL;
    }
}
