/**
 * Manejador de Errores del Backend
 *
 * Composable para manejar todos los tipos de errores HTTP
 * incluyendo errores de validación (422) y mapearlos al formato de VeeValidate
 *
 * Compatible con la respuesta estandarizada del backend:
 * {
 *   success: boolean,
 *   message: string,
 *   data: object|array|null,
 *   errors: object|null,  // Solo en errores de validación (422)
 *   meta: object|null     // Opcional (paginación, etc)
 * }
 */
export function useBackendValidation() {
    /**
     * Mapea los errores de validación de Laravel al formato de VeeValidate
     *
     * @param {Object} backendErrors - Objeto de errores de validación de Laravel
     * @returns {Object} - Errores mapeados para VeeValidate
     *
     * @example
     * // Backend retorna:
     * { email: ["El correo ya está registrado", "El formato es inválido"] }
     *
     * // Esta función retorna:
     * { email: "El correo ya está registrado" }
     */
    const mapBackendErrors = (backendErrors) => {
        const mappedErrors = {}

        Object.keys(backendErrors).forEach(key => {
            // Laravel retorna errores como arrays, tomamos el primer mensaje
            mappedErrors[key] = Array.isArray(backendErrors[key])
                ? backendErrors[key][0]
                : backendErrors[key]
        })

        return mappedErrors
    }

    /**
     * Verifica si el error es un error de validación (422)
     *
     * @param {Error} error - Objeto de error de Axios
     * @returns {boolean} - true si es error de validación, false en caso contrario
     */
    const isValidationError = (error) => {
        return error.response?.status === 422
    }

    /**
     * Extrae los errores de validación del error de axios
     * Adaptado a la respuesta estandarizada: { success, message, data, errors }
     *
     * @param {Error} error - Objeto de error de Axios
     * @returns {Object|null} - Errores del backend o null
     */
    const getValidationErrors = (error) => {
        if (isValidationError(error)) {
            // Nueva estructura: error.response.data.errors
            return error.response.data?.errors || null
        }
        return null
    }

    /**
     * Obtiene un mensaje de error amigable basado en el código de estado HTTP
     * Prioriza el mensaje del backend de la respuesta estandarizada
     *
     * @param {Error} error - Objeto de error de Axios
     * @returns {string} - Mensaje de error amigable para el usuario
     */
    const getErrorMessage = (error) => {
        // Sin respuesta - Error de red
        if (!error.response) {
            return 'Error de conexión. Por favor verifica tu conexión a internet.'
        }

        const status = error.response.status
        // Priorizar el mensaje del backend de la respuesta estandarizada
        const message = error.response.data?.message

        // Usar el mensaje personalizado del backend si está disponible
        if (message) {
            return message
        }

        // Mensajes por defecto basados en el código de estado
        switch (status) {
            case 400:
                return 'Solicitud inválida. Por favor verifica los datos enviados.'
            case 401:
                return 'No autorizado. Por favor inicia sesión nuevamente.'
            case 403:
                return 'No tienes permisos para realizar esta acción.'
            case 404:
                return 'Recurso no encontrado.'
            case 422:
                return 'Error de validación. Por favor verifica los campos.'
            case 429:
                return 'Demasiadas solicitudes. Por favor intenta más tarde.'
            case 500:
                return 'Error interno del servidor. Por favor contacta al administrador.'
            case 503:
                return 'Servicio no disponible. Por favor intenta más tarde.'
            default:
                return `Error del servidor (${status}). Por favor intenta nuevamente.`
        }
    }

    /**
     * Maneja el error y retorna un objeto con información estructurada
     * Compatible con la respuesta estandarizada del backend: { success, message, data, errors }
     *
     * @param {Error} error - Objeto de error de Axios
     * @returns {Object} - Objeto con información del error procesado
     * @returns {boolean} return.isValidationError - Indica si es un error de validación (422)
     * @returns {string} return.message - Mensaje de error del backend o mensaje por defecto
     * @returns {number|null} return.status - Código de estado HTTP
     * @returns {boolean} return.success - Flag de éxito (false en errores)
     * @returns {Object|null} return.validationErrors - Errores de validación si existen
     */
    const handleError = (error) => {
        const response = {
            isValidationError: isValidationError(error),
            message: getErrorMessage(error),
            status: error.response?.status || null,
            success: error.response?.data?.success || false,
            validationErrors: getValidationErrors(error)
        }

        return response
    }

    return {
        mapBackendErrors,
        isValidationError,
        getValidationErrors,
        getErrorMessage,
        handleError
    }
}
