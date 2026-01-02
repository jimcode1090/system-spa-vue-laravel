# Frontend API Integration Guide

## Standardized API Response Handling

All API endpoints now return a standardized response format. This guide explains how to properly handle these responses in the frontend.

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [...],
  "meta": {  // Optional (pagination, etc.)
    "pagination": {
      "total": 50,
      "per_page": 10,
      "current_page": 1,
      "last_page": 5
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error de validación",
  "data": null,
  "errors": {  // Only for validation errors (422)
    "email": ["El correo electrónico ya está registrado"],
    "username": ["El nombre de usuario debe tener al menos 4 caracteres"]
  }
}
```

## Service Layer Pattern

### UserService Example

```javascript
// resources/js/src/services/userService.js

class UserService {
    async getListUsers(filters = {}) {
        const { data } = await apiClient.get(API_CONFIG.ENDPOINT.USER.LIST, {
            params: filters
        })

        // ✅ ALWAYS check success and data
        if (data.success && data.data) {
            return data.data.map(User.fromApi)
        }

        // Return empty array as fallback
        return []
    }

    async createUser(formData) {
        const {data} = await apiClient.post(API_CONFIG.ENDPOINT.USER.CREATE, formData)

        // ✅ Check success before returning
        if (data.success && data.data) {
            return data.data
        }

        // Throw error if not successful (will be caught by ViewModel)
        throw new Error(data.message || 'Error al crear usuario')
    }

    async updateUser(id, formData) {
        const {data} = await apiClient.put(`${API_CONFIG.ENDPOINT.USER.UPDATE}/${id}`, formData)

        if (data.success && data.data) {
            return data.data
        }

        throw new Error(data.message || 'Error al actualizar usuario')
    }

    async deleteUser(id) {
        const {data} = await apiClient.delete(`${API_CONFIG.ENDPOINT.USER.DELETE}/${id}`)

        // Delete typically returns no data, just success message
        if (data.success) {
            return true
        }

        throw new Error(data.message || 'Error al eliminar usuario')
    }
}
```

## ViewModel Pattern

ViewModels use the `useBackendValidation` composable to handle all error types:

```javascript
// resources/js/src/viewmodels/useCreateUserViewModel.js

export function useCreateUserViewModel() {
    const {execute, loading: isSubmitting} = useAsync()
    const {handleError, mapBackendErrors} = useBackendValidation()
    const {error: notifyError, success: notifySuccess} = useNotification()

    const onSubmit = handleSubmit(async (values) => {
        try {
            // Service already handles response extraction
            const user = await execute(() => userService.createUser(formData))

            // ✅ Success - Service returned data.data
            notifySuccess('Usuario creado exitosamente')
            router.push({ name: 'users' })

        } catch (error) {
            // ❌ Error - Handle all types of errors
            const errorResponse = handleError(error)

            if (errorResponse.isValidationError && errorResponse.validationErrors) {
                // 422 Validation Error
                setErrors(mapBackendErrors(errorResponse.validationErrors))
                notifyError('Por favor corrija los errores de validación')
            } else {
                // Other errors (401, 403, 404, 500, network, etc.)
                notifyError(errorResponse.message)
            }
        }
    })
}
```

## Error Handling Flow

### 1. Validation Errors (422)

**Backend Response:**
```json
{
  "success": false,
  "message": "Error de validación",
  "data": null,
  "errors": {
    "email": ["El correo electrónico ya está registrado"]
  }
}
```

**Frontend Handling:**
```javascript
// Axios throws error for 422 status
catch (error) {
    const errorResponse = handleError(error)

    if (errorResponse.isValidationError) {
        // errorResponse.validationErrors = { email: [...] }
        setErrors(mapBackendErrors(errorResponse.validationErrors))
        notifyError('Por favor corrija los errores de validación')
    }
}
```

**Result:**
- VeeValidate shows field-specific errors
- Toast notification shows general message
- Form remains filled with user input

### 2. Not Found Errors (404)

**Backend Response:**
```json
{
  "success": false,
  "message": "Usuario no encontrado",
  "data": null
}
```

**Frontend Handling:**
```javascript
catch (error) {
    const errorResponse = handleError(error) // status: 404
    notifyError(errorResponse.message) // "Recurso no encontrado."
}
```

### 3. Unauthorized (401) / Forbidden (403)

**Backend Response:**
```json
{
  "success": false,
  "message": "No autorizado",
  "data": null
}
```

**Frontend Handling:**
```javascript
catch (error) {
    const errorResponse = handleError(error) // status: 401
    notifyError(errorResponse.message) // "No autorizado. Por favor inicia sesión..."
    // Optionally redirect to login
}
```

### 4. Server Errors (500)

**Development Response (APP_DEBUG=true):**
```json
{
  "success": false,
  "message": "Error al crear el usuario",
  "data": {
    "exception": "RuntimeException",
    "message": "Database connection failed",
    "file": "/app/Services/UserService.php",
    "line": 42
  }
}
```

**Production Response (APP_DEBUG=false):**
```json
{
  "success": false,
  "message": "Error al crear el usuario",
  "data": null
}
```

**Frontend Handling:**
```javascript
catch (error) {
    const errorResponse = handleError(error) // status: 500
    notifyError(errorResponse.message) // "Error interno del servidor..."
    // Log error details in development
    if (import.meta.env.DEV && error.response.data.data) {
        console.error('Server Error Details:', error.response.data.data)
    }
}
```

### 5. Network Errors

**Frontend Handling:**
```javascript
catch (error) {
    if (!error.response) {
        // Network error (no response from server)
        const errorResponse = handleError(error)
        notifyError(errorResponse.message) // "Error de conexión..."
    }
}
```

## With Pagination

### Backend Response
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    { "id": 1, "name": "Juan" },
    { "id": 2, "name": "María" }
  ],
  "meta": {
    "pagination": {
      "total": 50,
      "per_page": 10,
      "current_page": 1,
      "last_page": 5,
      "from": 1,
      "to": 10
    }
  }
}
```

### Service Handling
```javascript
async getListUsers(filters = {}, page = 1) {
    const { data } = await apiClient.get(API_CONFIG.ENDPOINT.USER.LIST, {
        params: { ...filters, page }
    })

    if (data.success && data.data) {
        return {
            users: data.data.map(User.fromApi),
            pagination: data.meta?.pagination || null
        }
    }

    return { users: [], pagination: null }
}
```

### ViewModel Handling
```javascript
const pagination = ref(null)

const fetchUsers = async (filters = {}, page = 1) => {
    try {
        const result = await execute(() => userService.getListUsers(filters, page))
        users.value = result.users
        pagination.value = result.pagination
    } catch (error) {
        // Handle error
    }
}
```

## Best Practices

### 1. Always Check `success` Flag

```javascript
// ✅ GOOD
if (data.success && data.data) {
    return data.data
}

// ❌ BAD - assumes success
return data.data
```

### 2. Provide Fallback Values

```javascript
// ✅ GOOD - returns empty array if no data
if (data.success && data.data) {
    return data.data.map(User.fromApi)
}
return []

// ❌ BAD - could return undefined
if (data.success) {
    return data.data.map(User.fromApi)
}
```

### 3. Use Error Messages from Response

```javascript
// ✅ GOOD - uses backend message
throw new Error(data.message || 'Error al crear usuario')

// ❌ BAD - hardcoded message ignores backend
throw new Error('Error al crear usuario')
```

### 4. Handle All Error Types

```javascript
// ✅ GOOD - comprehensive error handling
catch (error) {
    const errorResponse = handleError(error)

    if (errorResponse.isValidationError) {
        setErrors(mapBackendErrors(errorResponse.validationErrors))
        notifyError('Por favor corrija los errores de validación')
    } else {
        notifyError(errorResponse.message) // Handles 401, 403, 404, 500, network
    }
}

// ❌ BAD - only handles validation
catch (error) {
    if (error.response.status === 422) {
        setErrors(error.response.data.errors)
    }
    // Other errors not handled!
}
```

### 5. Log Errors in Development

```javascript
// ✅ GOOD - helps debugging
catch (error) {
    if (import.meta.env.DEV) {
        console.error('API Error:', error.response?.data)
    }
    // Handle error...
}
```

## Testing API Integration

### Unit Test Example (Service)

```javascript
import { describe, it, expect, vi } from 'vitest'
import { userService } from '@/services/userService'
import { apiClient } from '@/lib/axios'

describe('UserService', () => {
    it('returns users when API call succeeds', async () => {
        // Mock successful response
        vi.spyOn(apiClient, 'get').mockResolvedValue({
            data: {
                success: true,
                message: 'Usuarios obtenidos exitosamente',
                data: [
                    { id: 1, firstname: 'Juan' },
                    { id: 2, firstname: 'María' }
                ]
            }
        })

        const users = await userService.getListUsers()

        expect(users).toHaveLength(2)
        expect(users[0].id).toBe(1)
    })

    it('returns empty array when API call fails', async () => {
        // Mock error response
        vi.spyOn(apiClient, 'get').mockResolvedValue({
            data: {
                success: false,
                message: 'Error',
                data: null
            }
        })

        const users = await userService.getListUsers()

        expect(users).toEqual([])
    })
})
```

## Migration Checklist

When updating existing services to use standardized responses:

- [ ] Update service methods to check `data.success` before returning
- [ ] Update service methods to return `data.data` instead of `data`
- [ ] Provide fallback values (empty array, null, etc.)
- [ ] Throw errors with `data.message` if not successful
- [ ] Update ViewModels to use `useBackendValidation` composable
- [ ] Handle both validation errors (422) and other errors
- [ ] Update tests to mock new response format
- [ ] Remove hardcoded error messages in favor of backend messages

## Common Pitfalls

### ❌ Forgetting to unwrap data.data

```javascript
// Backend returns: { success: true, data: [...] }

// ❌ WRONG
const users = await userService.getListUsers()
// users = { success: true, data: [...] }
users.map(User.fromApi) // ERROR: users is object, not array!

// ✅ CORRECT - Service unwraps data.data
const users = await userService.getListUsers()
// users = [...] (already unwrapped in service)
users.map(User.fromApi) // Works!
```

### ❌ Not handling non-validation errors

```javascript
// ❌ WRONG - only handles validation
catch (error) {
    if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
    }
    // What about 404, 500, network errors?
}

// ✅ CORRECT - handles all errors
catch (error) {
    const errorResponse = handleError(error)
    if (errorResponse.isValidationError) {
        setErrors(mapBackendErrors(errorResponse.validationErrors))
    }
    notifyError(errorResponse.message) // Always show message
}
```

### ❌ Assuming success without checking

```javascript
// ❌ WRONG
const { data } = await apiClient.get('/users')
return data.data // Could be null if success: false!

// ✅ CORRECT
const { data } = await apiClient.get('/users')
if (data.success && data.data) {
    return data.data
}
return []
```

## Summary

1. **Backend** returns standardized format: `{ success, message, data, errors, meta }`
2. **Services** unwrap `data.data` and check `success` flag
3. **ViewModels** use `useBackendValidation` for comprehensive error handling
4. **Views** display errors via VeeValidate + toast notifications
5. **Always** provide fallback values when data might be null
6. **Always** handle all error types, not just validation errors
