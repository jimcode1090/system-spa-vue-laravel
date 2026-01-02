import * as yup from 'yup'
import { USER_STATES } from '@/src/constants/data-static.js'


export const useUserFilterSchema = () => {
    const validStates = USER_STATES.map(state => state.value)

    const schema = yup.object({
        name: yup
            .string()
            .nullable()
            .notRequired()
            .transform((value) => value === '' ? null : value)
            .min(2, 'El nombre debe tener al menos 2 caracteres')
            .max(50, 'El nombre no debe exceder 50 caracteres'),
        username: yup
            .string()
            .nullable()
            .notRequired()
            .transform((value) => value === '' ? null : value)
            .min(4, 'El nombre de usuario debe tener al menos 4 caracteres')
            .max(20, 'El nombre de usuario no debe exceder 20 caracteres'),
        email: yup
            .string()
            .nullable()
            .notRequired()
            .transform((value) => value === '' ? null : value)
            .email('Debe ingresar un correo electrónico válido')
            .max(100, 'El correo electrónico no debe exceder 100 caracteres'),
        state: yup
            .string()
            .nullable()
            .notRequired()
            .oneOf([...validStates, null], 'Debe seleccionar un estado válido')
    })

    return {
        schema
    }
}
