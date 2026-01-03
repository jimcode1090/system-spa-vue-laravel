<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // TODO: Implementar autorización
    }


    public function rules(): array
    {
        // Obtener el ID del usuario a actualizar
        $userId = $this->input('id');

        return [
            'id' => ['required', 'integer', 'exists:users,id'],

            // Nombres - obligatorios
            'firstname' => [
                'required',
                'string',
                'min:2',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],

            'secondname' => [
                'nullable',
                'string',
                'min:2',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],

            'lastname' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],

            // Credenciales - obligatorias y únicas (excepto el usuario actual)
            'username' => [
                'required',
                'string',
                'min:4',
                'max:20',
                'regex:/^[a-zA-Z0-9_-]+$/',
                Rule::unique('users', 'username')->ignore($userId)
            ],

            'email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('users', 'email')->ignore($userId)
            ],

            // Password - OPCIONAL en actualización (solo si se quiere cambiar)
            'password' => [
                'nullable',
                'string',
                'min:8',
                'max:50',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/'
            ],

            // Archivo - opcional
            'file' => [
                'nullable',
                'file',
                'image',
                'mimes:jpeg,jpg,png,gif',
                'max:2048' // 2MB
            ],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // ID
            'id.required' => 'El ID del usuario es obligatorio',
            'id.integer' => 'El ID del usuario debe ser un número entero',
            'id.exists' => 'El usuario no existe',

            // Firstname
            'firstname.required' => 'El primer nombre es obligatorio',
            'firstname.min' => 'El primer nombre debe tener al menos 2 caracteres',
            'firstname.max' => 'El primer nombre no debe superar 50 caracteres',
            'firstname.regex' => 'El primer nombre solo puede contener letras',

            // Secondname
            'secondname.min' => 'El segundo nombre debe tener al menos 2 caracteres',
            'secondname.max' => 'El segundo nombre no debe superar 50 caracteres',
            'secondname.regex' => 'El segundo nombre solo puede contener letras',

            // Lastname
            'lastname.required' => 'Los apellidos son obligatorios',
            'lastname.min' => 'Los apellidos deben tener al menos 2 caracteres',
            'lastname.max' => 'Los apellidos no deben superar 100 caracteres',
            'lastname.regex' => 'Los apellidos solo pueden contener letras',

            // Username
            'username.required' => 'El nombre de usuario es obligatorio',
            'username.min' => 'El nombre de usuario debe tener al menos 4 caracteres',
            'username.max' => 'El nombre de usuario no debe superar 20 caracteres',
            'username.regex' => 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos',
            'username.unique' => 'El nombre de usuario ya está registrado',

            // Email
            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'Debe ser un correo electrónico válido',
            'email.max' => 'El correo electrónico no debe superar 100 caracteres',
            'email.unique' => 'El correo electrónico ya está registrado',

            // Password (opcional)
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'password.max' => 'La contraseña no debe superar 50 caracteres',
            'password.regex' => 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',

            // File
            'file.file' => 'El archivo debe ser un archivo válido',
            'file.image' => 'El archivo debe ser una imagen',
            'file.mimes' => 'Solo se permiten imágenes JPG, PNG o GIF',
            'file.max' => 'El archivo no debe superar 2MB',
        ];
    }
}
