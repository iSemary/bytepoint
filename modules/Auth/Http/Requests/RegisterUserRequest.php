<?php

namespace Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array {
        return [
            'name' => 'required|max:164',
            'email' => 'required|max:255',
            'password' => 'required|confirmed|max:255|min:8',
            'country_id' => 'required|numeric',
            'customer_title' => 'required|max:255',
            'customer_username' => 'required|max:64|unique:tenants,name|unique:customers,username|min:2|regex:/^[a-zA-Z0-9]+$/',
            'category_id' => 'required|numeric',
        ];
    }
}
