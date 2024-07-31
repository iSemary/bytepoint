<?php

namespace Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|max:255',
            'description' => 'nullable|max:5000',
            'purpose_id' => 'required|numeric',
            'method_id' => 'required|numeric',
            'end_point' => 'required|string|min:3|max:255|unique:apis,end_point',
            'data_repository_id' => 'nullable|numeric|exists:data_repositories,id',
            'body_type_id' => 'required|numeric|exists:body_types,id',
            'headers' => 'array',
            'body' => 'array',
            'settings' => 'nullable|array',
            'parameters' => 'array',
        ];
    }
}
