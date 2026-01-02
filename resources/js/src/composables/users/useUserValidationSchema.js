import * as yup from 'yup'

export function useUserValidationSchema() {
    const schema = yup.object({
        firstname: yup
            .string()
            .required('El primer nombre es obligatorio')
            .min(2, 'El primer nombre debe tener al menos 2 caracteres')
            .max(50, 'El primer nombre no debe exceder 50 caracteres')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El primer nombre solo puede contener letras'),

        secondname: yup
            .string()
            .nullable()
            .notRequired()
            .min(2, 'El segundo nombre debe tener al menos 2 caracteres')
            .max(50, 'El segundo nombre no debe exceder 50 caracteres')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'El segundo nombre solo puede contener letras'),

        lastname: yup
            .string()
            .required('Los apellidos son obligatorios')
            .min(2, 'Los apellidos deben tener al menos 2 caracteres')
            .max(100, 'Los apellidos no deben exceder 100 caracteres')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras'),

        username: yup
            .string()
            .required('El nombre de usuario es obligatorio')
            .min(4, 'El nombre de usuario debe tener al menos 4 caracteres')
            .max(20, 'El nombre de usuario no debe exceder 20 caracteres')
            .matches(/^[a-zA-Z0-9_-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'),

        email: yup
            .string()
            .required('El correo electrónico es obligatorio')
            .email('Debe ingresar un correo electrónico válido')
            .max(100, 'El correo electrónico no debe exceder 100 caracteres'),

        password: yup
            .string()
            .required('La contraseña es obligatoria')
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .max(50, 'La contraseña no debe exceder 50 caracteres')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
            ),

        file: yup
            .mixed()
            .nullable()
            .notRequired()
            .test('fileSize', 'El archivo no debe superar 2MB', (value) => {
                if (!value) return true
                return value.size <= 2 * 1024 * 1024 // 2MB
            })
            .test('fileType', 'Solo se permiten imágenes (JPG, PNG, GIF)', (value) => {
                if (!value) return true
                return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type)
            })
    })

    return {
        schema
    }
}
