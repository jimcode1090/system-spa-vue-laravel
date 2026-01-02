# Error Handling Documentation

## Sistema de Manejo de Errores

Este proyecto implementa un manejo completo de errores HTTP tanto para errores de validación (422) como para cualquier otro tipo de error.

## Composables Utilizados

### 1. `useBackendValidation`
Maneja todos los tipos de errores HTTP y mapea errores de validación de Laravel a VeeValidate.

### 2. `useNotification`
Sistema de notificaciones para mostrar mensajes al usuario (puede reemplazarse con vue-toastification, SweetAlert2, etc.)

## Tipos de Errores Manejados

### Error de Validación (422)
```javascript
// Backend devuelve:
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["El nombre debe tener al menos 2 caracteres"],
    "email": ["Debe ingresar un correo electrónico válido"]
  }
}

// Frontend maneja:
const errorResponse = handleError(err)
// errorResponse = {
//   isValidationError: true,
//   message: "Error de validación. Por favor verifica los campos.",
//   status: 422,
//   validationErrors: { name: [...], email: [...] }
// }

// Se mapean a los campos del formulario
setErrors(mapBackendErrors(errorResponse.validationErrors))
// Los errores aparecen automáticamente bajo cada campo
```

### Error de Autenticación (401)
```javascript
// Usuario no autenticado o token expirado
{
  "message": "Unauthenticated."
}

// Frontend muestra:
"No autorizado. Por favor inicia sesión nuevamente."
```

### Error de Permisos (403)
```javascript
// Usuario sin permisos para la acción
{
  "message": "This action is unauthorized."
}

// Frontend muestra:
"No tienes permisos para realizar esta acción."
```

### Recurso No Encontrado (404)
```javascript
// Recurso solicitado no existe
{
  "message": "Not Found"
}

// Frontend muestra:
"Recurso no encontrado."
```

### Error del Servidor (500)
```javascript
// Error interno del servidor
{
  "message": "Server Error"
}

// Frontend muestra:
"Error interno del servidor. Por favor contacta al administrador."
```

### Error de Red (Sin respuesta)
```javascript
// Sin conexión o servidor no responde
// No hay response del backend

// Frontend muestra:
"Error de conexión. Por favor verifica tu conexión a internet."
```

### Rate Limiting (429)
```javascript
// Demasiadas solicitudes
{
  "message": "Too Many Requests"
}

// Frontend muestra:
"Demasiadas solicitudes. Por favor intenta más tarde."
```

### Servicio No Disponible (503)
```javascript
// Servidor en mantenimiento
{
  "message": "Service Unavailable"
}

// Frontend muestra:
"Servicio no disponible. Por favor intenta más tarde."
```

## Flujo de Manejo de Errores

```
1. Usuario realiza acción
   ↓
2. ViewModel ejecuta servicio
   ↓
3. Service hace petición HTTP
   ↓
4. Backend procesa y puede retornar error
   ↓
5. Axios captura el error
   ↓
6. useBackendValidation.handleError() procesa el error
   ↓
7a. Si es error 422 (validación):
    → Mapea errores a VeeValidate
    → Muestra errores en los campos del formulario
    → Notificación de error de validación
   ↓
7b. Si es otro tipo de error:
    → Obtiene mensaje user-friendly basado en status code
    → Muestra notificación con el mensaje
   ↓
8. Error se lanza de nuevo para que el ViewModel lo maneje si es necesario
```

## Implementación en ViewModel

```javascript
import { useBackendValidation } from '@/src/composables/utilities/useBackendValidation.js'
import { useNotification } from '@/src/composables/utilities/useNotification.js'

export function useMyViewModel() {
    const { handleError, mapBackendErrors } = useBackendValidation()
    const { error: notifyError, success: notifySuccess } = useNotification()
    const { setErrors } = useForm({ ... })

    const fetchData = async () => {
        try {
            // Hacer petición
            const data = await myService.getData()
            notifySuccess('Datos obtenidos exitosamente')
        } catch (err) {
            // Manejar todos los tipos de errores
            const errorResponse = handleError(err)

            if (errorResponse.isValidationError && errorResponse.validationErrors) {
                // Error de validación → Mostrar en formulario
                setErrors(mapBackendErrors(errorResponse.validationErrors))
                notifyError('Por favor corrija los errores de validación')
            } else {
                // Otro tipo de error → Notificación
                notifyError(errorResponse.message)
            }

            // Logging para debugging
            console.error('Error details:', errorResponse)
        }
    }

    return { fetchData }
}
```

## Ejemplos de Uso

### Ejemplo 1: Error de Validación
```javascript
// Usuario envía formulario con datos inválidos
// Backend valida con FormRequest y retorna 422

// En el frontend:
try {
    await userService.createUser(userData)
} catch (err) {
    const errorResponse = handleError(err)
    // errorResponse.isValidationError = true
    // errorResponse.validationErrors = { email: "Email ya existe", ... }

    setErrors(mapBackendErrors(errorResponse.validationErrors))
    // Los errores aparecen automáticamente en el formulario
}
```

### Ejemplo 2: Error de Servidor
```javascript
// Servidor tiene un error interno

try {
    await userService.getUsers()
} catch (err) {
    const errorResponse = handleError(err)
    // errorResponse.status = 500
    // errorResponse.message = "Error interno del servidor..."

    notifyError(errorResponse.message)
    // Usuario ve notificación con mensaje amigable
}
```

### Ejemplo 3: Sin Conexión
```javascript
// Usuario sin internet

try {
    await userService.getUsers()
} catch (err) {
    const errorResponse = handleError(err)
    // errorResponse.status = null
    // errorResponse.message = "Error de conexión..."

    notifyError(errorResponse.message)
    // Usuario ve que hay problema de conexión
}
```

## Personalización de Mensajes

### Desde el Backend
```php
// En Laravel, puedes retornar mensajes personalizados
return response()->json([
    'message' => 'No se pueden obtener los usuarios en este momento'
], 500);

// El frontend mostrará este mensaje en lugar del genérico
```

### Desde el Frontend
```javascript
// Puedes sobrescribir mensajes en casos específicos
const errorResponse = handleError(err)

if (errorResponse.status === 404) {
    notifyError('Usuario no encontrado. Por favor verifica el ID.')
} else {
    notifyError(errorResponse.message)
}
```

## Mejoras Futuras

### Integrar Librería de Toast
Reemplazar `useNotification` con:
- **vue-toastification** - Toast notifications
- **SweetAlert2** - Alertas elegantes
- **Notyf** - Notificaciones ligeras

```bash
npm install vue-toastification
```

```javascript
import { useToast } from 'vue-toastification'

const toast = useToast()
toast.error(errorResponse.message)
```

### Logging Centralizado
Enviar errores a servicio de logging:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Rollbar** - Error monitoring

### Reintentos Automáticos
Para errores temporales (503, timeout):
```javascript
const retryRequest = async (fn, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn()
        } catch (err) {
            if (i === maxRetries - 1) throw err
            await new Promise(r => setTimeout(r, 1000 * (i + 1)))
        }
    }
}
```

## Testing

### Test de Validación de Errores
```javascript
// tests/unit/useBackendValidation.spec.js
describe('useBackendValidation', () => {
    it('detects validation errors (422)', () => {
        const error = {
            response: {
                status: 422,
                data: { errors: { email: ['Invalid email'] } }
            }
        }

        const { isValidationError } = useBackendValidation()
        expect(isValidationError(error)).toBe(true)
    })

    it('gets user-friendly message for 500 error', () => {
        const error = { response: { status: 500 } }

        const { getErrorMessage } = useBackendValidation()
        expect(getErrorMessage(error)).toContain('servidor')
    })
})
```

## Resumen

✅ Maneja **todos los tipos de errores HTTP**
✅ Mapea errores de validación a campos del formulario
✅ Mensajes user-friendly para todos los errores
✅ Sistema de notificaciones integrado
✅ Logging detallado para debugging
✅ Fácil de extender y personalizar
✅ Compatible con librerías de UI (toast, sweet alert, etc.)
