import * as yup from 'yup'

/**
 * Schema de validación para editar usuarios
 *
 * Diferencias con creación:
 * - Password es opcional (solo si se quiere cambiar)
 * - ID del usuario se obtiene de route.params.id, no del formulario
 * - Email y Username se validan en backend (unique excepto el usuario actual)
 */
export function useEditUserValidationSchema() {
    const schema = yup.object({
        // Nombres - obligatorios
        firstname: yup.string()
            .required('El primer nombre es obligatorio')
            .min(2, 'El primer nombre debe tener al menos 2 caracteres')
            .max(50, 'El primer nombre no debe superar 50 caracteres')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El primer nombre solo puede contener letras'),

        secondname: yup.string()
            .nullable()
            .notRequired()
            .transform((value) => value === '' ? null : value)
            .min(2, 'El segundo nombre debe tener al menos 2 caracteres')
            .max(50, 'El segundo nombre no debe superar 50 caracteres')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El segundo nombre solo puede contener letras'),

        lastname: yup.string()
            .required('Los apellidos son obligatorios')
            .min(2, 'Los apellidos deben tener al menos 2 caracteres')
            .max(100, 'Los apellidos no deben superar 100 caracteres')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras'),

        // Credenciales - obligatorias
        username: yup.string()
            .required('El nombre de usuario es obligatorio')
            .min(4, 'El nombre de usuario debe tener al menos 4 caracteres')
            .max(20, 'El nombre de usuario no debe superar 20 caracteres')
            .matches(/^[a-zA-Z0-9_-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'),

        email: yup.string()
            .required('El correo electrónico es obligatorio')
            .email('Debe ser un correo electrónico válido')
            .max(100, 'El correo electrónico no debe superar 100 caracteres'),

        // Password - OPCIONAL en edición (solo si se quiere cambiar)
        // Si está vacío, no se actualiza
        password: yup.string()
            .nullable()
            .notRequired()
            .transform((value) => value === '' ? null : value)
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .max(50, 'La contraseña no debe superar 50 caracteres')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
            ),

        // Archivo - opcional
        file: yup.mixed()
            .nullable()
            .notRequired()
            .test('fileSize', 'El archivo no debe superar 2MB', (value) => {
                if (!value) return true // Archivo opcional
                return value.size <= 2 * 1024 * 1024 // 2MB
            })
            .test('fileType', 'Solo se permiten imágenes (JPG, PNG, GIF)', (value) => {
                if (!value) return true
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
                return validTypes.includes(value.type)
            })
    })

    return { schema }
}
