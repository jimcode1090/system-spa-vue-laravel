<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
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
            'firstname' => ['required', 'string', 'min:2', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'secondname' => ['nullable', 'string', 'min:2', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/'],
            'lastname' => ['required', 'string', 'min:2', 'max:100', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'username' => ['required', 'string', 'min:4', 'max:20', 'regex:/^[a-zA-Z0-9_-]+$/', 'unique:users,username'],
            'email' => ['required', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:50', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/'],
            'file' => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png,gif', 'max:2048'], // 2MB max
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
            'firstname.required' => 'El primer nombre es obligatorio',
            'firstname.min' => 'El primer nombre debe tener al menos :min caracteres',
            'firstname.max' => 'El primer nombre no debe exceder :max caracteres',
            'firstname.regex' => 'El primer nombre solo puede contener letras',

            'secondname.min' => 'El segundo nombre debe tener al menos :min caracteres',
            'secondname.max' => 'El segundo nombre no debe exceder :max caracteres',
            'secondname.regex' => 'El segundo nombre solo puede contener letras',

            'lastname.required' => 'Los apellidos son obligatorios',
            'lastname.min' => 'Los apellidos deben tener al menos :min caracteres',
            'lastname.max' => 'Los apellidos no deben exceder :max caracteres',
            'lastname.regex' => 'Los apellidos solo pueden contener letras',

            'username.required' => 'El nombre de usuario es obligatorio',
            'username.min' => 'El nombre de usuario debe tener al menos :min caracteres',
            'username.max' => 'El nombre de usuario no debe exceder :max caracteres',
            'username.regex' => 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos',
            'username.unique' => 'El nombre de usuario ya está en uso',

            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'Debe ingresar un correo electrónico válido',
            'email.max' => 'El correo electrónico no debe exceder :max caracteres',
            'email.unique' => 'El correo electrónico ya está registrado',

            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos :min caracteres',
            'password.max' => 'La contraseña no debe exceder :max caracteres',
            'password.regex' => 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',

            'file.image' => 'El archivo debe ser una imagen',
            'file.mimes' => 'Solo se permiten imágenes en formato JPG, PNG o GIF',
            'file.max' => 'El archivo no debe superar 2MB',
        ];
    }
}
