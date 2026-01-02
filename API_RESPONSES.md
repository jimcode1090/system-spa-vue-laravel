# API Response Standardization

## Trait ApiResponser

Todas las respuestas de la API ahora siguen un formato estándar para facilitar el manejo en el frontend.

## Estructura de Respuesta

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... },
  "meta": { ... }  // Opcional (paginación, etc.)
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Mensaje de error",
  "data": null,
  "errors": {  // Opcional (errores de validación)
    "field": ["Error message"]
  }
}
```

## Métodos Principales

### 1. jsonResponse() - Base
Método principal que construye todas las respuestas.

```php
protected function jsonResponse(
    bool $success,
    string $message,
    $data = null,
    int $code = 200,
    ?array $errors = null,
    ?array $meta = null
): JsonResponse
```

### 2. successResponse()
Para respuestas exitosas.

```php
protected function successResponse(
    $data = null,
    string $message = 'Operación exitosa',
    int $code = 200,
    ?array $meta = null
): JsonResponse
```

### 3. errorResponse()
Para respuestas de error.

```php
protected function errorResponse(
    string $message = 'Ha ocurrido un error',
    int $code = 400,
    ?array $errors = null,
    $data = null
): JsonResponse
```

### 4. serverErrorResponse()
Para errores del servidor (500).

```php
protected function serverErrorResponse(
    string $message = 'Error interno del servidor',
    ?\Exception $exception = null
): JsonResponse
```

## Ejemplos de Uso

### Listar Recursos (200)
```php
public function index()
{
    $users = $this->userService->getListUsers();

    return $this->successResponse(
        $users,
        'Usuarios obtenidos exitosamente'
    );
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    { "id": 1, "name": "Juan" },
    { "id": 2, "name": "María" }
  ]
}
```

### Crear Recurso (201)
```php
public function store(CreateUserRequest $request)
{
    $user = $this->userService->createUser($request->validated());

    return $this->successResponse(
        $user,
        'Usuario creado exitosamente',
        201
    );
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 3,
    "name": "Pedro",
    "email": "pedro@example.com"
  }
}
```

### Actualizar Recurso (200)
```php
public function update(Request $request, $id)
{
    $user = $this->userService->updateUser($id, $request->validated());

    return $this->successResponse(
        $user,
        'Usuario actualizado exitosamente'
    );
}
```

### Eliminar Recurso (200)
```php
public function destroy($id)
{
    $this->userService->deleteUser($id);

    return $this->successResponse(
        null,
        'Usuario eliminado exitosamente'
    );
}
```

### Recurso No Encontrado (404)
```php
public function show($id)
{
    $user = $this->userService->getUserById($id);

    if (!$user) {
        return $this->errorResponse(
            'Usuario no encontrado',
            404
        );
    }

    return $this->successResponse($user);
}
```

**Response:**
```json
{
  "success": false,
  "message": "Usuario no encontrado",
  "data": null
}
```

### Error de Validación (422)
Laravel automáticamente maneja esto con FormRequest, pero puedes personalizarlo:

```php
// En app/Exceptions/Handler.php
protected function invalidJson($request, ValidationException $exception)
{
    return response()->json([
        'success' => false,
        'message' => 'Error de validación',
        'data' => null,
        'errors' => $exception->errors()
    ], 422);
}
```

**Response:**
```json
{
  "success": false,
  "message": "Error de validación",
  "data": null,
  "errors": {
    "email": ["El correo electrónico ya está registrado"],
    "username": ["El nombre de usuario debe tener al menos 4 caracteres"]
  }
}
```

### Error del Servidor (500)
```php
public function store(Request $request)
{
    try {
        $user = $this->userService->createUser($request->all());
        return $this->successResponse($user, 'Usuario creado', 201);
    } catch (\Exception $e) {
        return $this->serverErrorResponse(
            'Error al crear el usuario',
            $e
        );
    }
}
```

**Response (Development):**
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

**Response (Production - APP_DEBUG=false):**
```json
{
  "success": false,
  "message": "Error al crear el usuario",
  "data": null
}
```

### Con Paginación
```php
public function index(Request $request)
{
    $users = User::paginate(10);

    return $this->successResponse(
        $users->items(),
        'Usuarios obtenidos exitosamente',
        200,
        [
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem()
            ]
        ]
    );
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [...],
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

## Ventajas

### 1. Consistencia
Todas las respuestas tienen la misma estructura.

### 2. Predecible
El frontend siempre sabe qué esperar:
- `success` → boolean
- `message` → string
- `data` → objeto/array/null
- `errors` → objeto/null (solo en errores de validación)
- `meta` → objeto/null (información adicional)

### 3. Fácil Manejo en Frontend
```javascript
// En cualquier servicio
try {
    const response = await apiClient.get('/users')

    if (response.data.success) {
        // ✅ Todo OK
        return response.data.data
    } else {
        // ❌ Error controlado
        throw new Error(response.data.message)
    }
} catch (error) {
    // Manejar error
}
```

### 4. DRY (Don't Repeat Yourself)
Solo 3 métodos principales:
- `jsonResponse()` - Constructor base
- `successResponse()` - Para éxitos
- `errorResponse()` - Para errores
- `serverErrorResponse()` - Para errores 500 (con debug info)

### 5. Código HTTP Estándar
- **200** - OK
- **201** - Created
- **204** - No Content
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **422** - Validation Error
- **500** - Server Error

## Uso en Controllers

```php
<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponser;

class UserController extends Controller
{
    use ApiResponser;

    public function index()
    {
        try {
            $users = $this->service->getAll();
            return $this->successResponse($users);
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Error al obtener usuarios', $e);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = $this->service->create($request->validated());
            return $this->successResponse($user, 'Usuario creado', 201);
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Error al crear usuario', $e);
        }
    }
}
```

## Migración de Código Existente

### Antes
```php
return response()->json($users);
return response()->json(['message' => 'Created'], 201);
return response()->json(['error' => 'Not found'], 404);
```

### Después
```php
return $this->successResponse($users, 'Usuarios obtenidos');
return $this->successResponse($user, 'Usuario creado', 201);
return $this->errorResponse('Usuario no encontrado', 404);
```

## Testing

```php
public function test_can_list_users()
{
    $response = $this->getJson('/api/users');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => ['id', 'name', 'email']
            ]
        ])
        ->assertJson([
            'success' => true
        ]);
}
```
