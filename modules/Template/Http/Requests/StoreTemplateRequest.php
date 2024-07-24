<?php 

namespace Modules\Template\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateRequest extends FormRequest
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
            'data_repository_title' => 'required|max:255',
            'data_repository_description' => 'nullable|max:5000',
            'api_title' => 'required|max:255',
            'api_description' => 'nullable|max:5000',
            'end_point' => 'required|string|min:3|max:255|unique:apis,end_point',
        ];
    }
}
