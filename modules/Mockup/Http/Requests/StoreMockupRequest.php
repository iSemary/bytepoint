<?php

namespace Modules\Mockup\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMockupRequest extends FormRequest
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

            'base_method_id' => 'required|numeric',
            'base_body_type_id' => 'required|numeric|exists:body_types,id',
            'base_end_point' => 'required|string|min:3|max:255|unique:apis,end_point',
            'base_headers' => 'array',
            'base_body' => 'array',
            'base_parameters' => 'array',

            'mock_method_id' => 'required|numeric',
            'mock_end_point' => 'required|string|min:3|max:255|unique:apis,end_point',
            'mock_body_type_id' => 'required|numeric|exists:body_types,id',
            'mock_headers' => 'array',
            'mock_body' => 'array',
            'mock_parameters' => 'array',
            'mock_response' => 'array',
        ];
    }
}
