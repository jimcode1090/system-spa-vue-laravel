<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Foundation\Http\FormRequest;

class ListUsersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'min:2', 'max:50'],
            'username' => ['nullable', 'string', 'min:4', 'max:20'],
            'email' => ['nullable', 'email', 'max:100'],
            'state' => ['nullable', 'string', 'in:A,I'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.min' => 'El nombre debe tener al menos :min caracteres',
            'name.max' => 'El nombre no debe exceder :max caracteres',
            'username.min' => 'El nombre de usuario debe tener al menos :min caracteres',
            'username.max' => 'El nombre de usuario no debe exceder :max caracteres',
            'email.email' => 'Debe ingresar un correo electrónico válido',
            'email.max' => 'El correo electrónico no debe exceder :max caracteres',
            'state.in' => 'El estado debe ser Activo (A) o Inactivo (I)',
        ];
    }
}
