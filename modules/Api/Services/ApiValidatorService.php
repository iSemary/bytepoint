<?php

namespace Modules\Api\Services;

use Illuminate\Http\Request;
use Modules\Api\Entities\Api;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ApiValidatorService
{
    public function validate(Api $api, Request $request)
    {
        $this->validateMethod($api, $request);
        $this->validateHeaders($api, $request);
        $this->validateAuthentication($api, $request);
        $this->validateParameters($api, $request);
        $this->validateBody($api, $request);
    }

    private function validateMethod(Api $api, Request $request)
    {
        if (strtoupper($api->method) !== $request->method()) {
            throw ValidationException::withMessages([
                'method' => ['The request method does not match the API method.']
            ]);
        }
    }

    private function validateHeaders(Api $api, Request $request)
    {
        foreach ($api->headers as $header) {
            if (!$request->hasHeader($header['key']['label'])) {
                throw ValidationException::withMessages([
                    'headers' => ["The required header '{$header['key']['label']}' is missing."]
                ]);
            }
        }
    }

    private function validateAuthentication(Api $api, Request $request)
    {
        if ($api->is_authenticated) {
            if (!$request->hasHeader("Authorization")) {
                throw ValidationException::withMessages([
                    'authentication' => ['This API requires authentication. Authorization header is missing.']
                ]);
            }

            if ($request->header("Authorization") != $api->authorization_key) {
                throw ValidationException::withMessages([
                    'authentication' => ['Invalid Authorization.']
                ]);
            }
        }
    }

    private function validateParameters(Api $api, Request $request)
    {
        $rules = [];
        $messages = [];

        foreach ($api->parameters as $parameter) {
            $rules[$parameter->key] = 'required';
            $messages["{$parameter->key}.required"] = "The parameter '{$parameter->key}' is required.";
        }

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    private function validateBody(Api $api, Request $request)
    {
        if ($api->body_type_id == 1) {
            $rules = [];
            $messages = [];

            foreach ($api->body as $bodyField) {
                $rules[$bodyField->key] = 'required';
                $messages["{$bodyField->key}.required"] = "The body field '{$bodyField->key}' is required.";
            }

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }
    }
}
