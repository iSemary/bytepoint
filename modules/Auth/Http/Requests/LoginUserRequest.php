<?php

namespace Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginUserRequest extends FormRequest {
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
            'subdomain' => 'required|max:64|exists:tenants,name|exists:customers,username|min:2|regex:/^[a-zA-Z0-9]+$/',
            'email' => 'required|email|max:255',
            'password' => 'required|max:255|min:8',
        ];
    }
}
