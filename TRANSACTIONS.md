# Database Transactions - User Creation with File Upload

## Problema Resuelto

**Error Original:**
```
SQLSTATE[23000]: Integrity constraint violation: 1452
Cannot add or update a child row: a foreign key constraint fails
(`db_spa_vue_laravel`.`users`, CONSTRAINT `users_file_id_foreign`
FOREIGN KEY (`file_id`) REFERENCES `files` (`id`))
```

**Causa:**
- El archivo se creaba en la tabla `files` (con `idFile` correcto)
- Pero al crear el usuario, se pasaba `file_id = 0` en lugar del ID real
- El stored procedure `sp_File_setStoreFile` retornaba el ID como `idFile`, no como `id`

## Solución Implementada

### 1. Corrección del FileRepository

```php
// Antes (retornaba 0)
return $result[0]->id ?? $result[0]->file_id ?? 0;

// Después (busca también idFile)
return $result[0]->id ?? $result[0]->idFile ?? 0;
```

### 2. Implementación de Transacciones

El `UserService` ahora utiliza transacciones de base de datos para garantizar consistencia:

```php
DB::beginTransaction();

try {
    // 1. Subir archivo → obtener file_id
    // 2. Hash password
    // 3. Crear usuario con file_id

    DB::commit(); // ✅ Todo OK

} catch (\Exception $e) {
    DB::rollBack(); // ❌ Algo falló

    // Eliminar archivo físico y registro en DB
    $this->fileService->deleteFile($fileId);

    throw $e;
}
```

## Flujo de Transacción

### Caso 1: Todo Exitoso ✅

```
1. DB::beginTransaction()
2. FileService.storeFile()
   ├─ Storage: Guarda archivo físico en storage/app/public/uploads/users/
   └─ DB: sp_File_setStoreFile() → retorna idFile = 1
3. Hash password
4. UserRepository.create(file_id = 1)
   └─ DB: sp_User_setCreateUser() → crea usuario con file_id = 1
5. DB::commit() ✅
   └─ Cambios permanentes en DB
```

**Resultado:**
- ✅ Archivo guardado en `files` tabla
- ✅ Archivo físico en storage
- ✅ Usuario creado con relación correcta a `file_id`

### Caso 2: Error al Crear Usuario ❌

```
1. DB::beginTransaction()
2. FileService.storeFile()
   ├─ Storage: Guarda archivo físico ✅
   └─ DB: sp_File_setStoreFile() → idFile = 1 ✅
3. Hash password ✅
4. UserRepository.create(file_id = 1)
   └─ DB: sp_User_setCreateUser() → ❌ ERROR (email duplicado, username duplicado, etc.)
5. catch (\Exception $e)
6. DB::rollBack()
   └─ Revierte INSERT en files ✅
7. FileService.deleteFile(1)
   └─ Elimina archivo físico del storage ✅
8. throw $e (propaga error al controller)
```

**Resultado:**
- ✅ No hay registro huérfano en `files`
- ✅ No hay archivo físico huérfano en storage
- ✅ Base de datos consistente
- ⚠️  Frontend recibe error 422 con detalles

### Caso 3: Error al Subir Archivo ❌

```
1. DB::beginTransaction()
2. FileService.storeFile()
   ├─ Storage: ❌ ERROR (permisos, disco lleno, etc.)
   └─ throw Exception
3. catch (\Exception $e)
4. DB::rollBack()
   └─ No hay nada que revertir (no se insertó en DB)
5. throw $e
```

**Resultado:**
- ✅ No se crea usuario
- ✅ No se guarda archivo
- ✅ Base de datos consistente

## Ventajas de Esta Implementación

### 1. Atomicidad
Todo o nada. Si falla algún paso, se revierten TODOS los cambios.

### 2. Consistencia
Nunca tendremos:
- ❌ Usuarios sin archivo (cuando se subió un archivo)
- ❌ Archivos sin usuario (huérfanos en `files` tabla)
- ❌ Archivos físicos huérfanos en storage

### 3. Logging Detallado
```php
Log::info('File uploaded successfully', ['file_id' => $fileId]);
Log::info('Creating user with data', [...]);
Log::error('Error creating user', ['error' => $e->getMessage()]);
Log::info('Rolled back: File deleted', ['file_id' => $fileId]);
```

Puedes revisar logs en `storage/logs/laravel.log`

### 4. Manejo de Errores
El frontend recibe errores claros:
- Validación: 422 con campos específicos
- Error de servidor: 500 con mensaje descriptivo
- Error de archivo: Mensaje específico del problema

## Casos de Uso Cubiertos

### Usuario SIN Archivo
```php
$user = $userService->createUser([
    'firstname' => 'Juan',
    // ... otros campos
], null); // ✅ file = null

// file_id = null en DB
```

### Usuario CON Archivo
```php
$user = $userService->createUser([
    'firstname' => 'Juan',
    // ... otros campos
], $uploadedFile); // ✅ file presente

// 1. Archivo guardado → file_id = X
// 2. Usuario creado con file_id = X
```

### Error de Validación (Email Duplicado)
```php
// DB tiene: users(email = 'juan@example.com')

$user = $userService->createUser([
    'email' => 'juan@example.com', // ❌ Duplicado
    // ...
], $uploadedFile);

// Transacción:
// 1. Archivo guardado ✅
// 2. Crear usuario → ERROR (unique constraint)
// 3. Rollback → archivo eliminado ✅
// 4. Exception propagada al controller
// 5. Frontend recibe 422 con error de email
```

## Monitoreo y Debugging

### Revisar Logs
```bash
tail -f storage/logs/laravel.log
```

### Logs que verás:

**Éxito:**
```
[INFO] File uploaded successfully {"file_id":1}
[INFO] Creating user with data {"username":"jimcode","email":"...","file_id":1}
[INFO] User created successfully {"user":{...}}
```

**Error:**
```
[INFO] File uploaded successfully {"file_id":1}
[INFO] Creating user with data {"username":"jimcode","email":"...","file_id":1}
[ERROR] Error creating user {"error":"SQLSTATE[23000]: ...","file_id":1}
[INFO] Rolled back: File deleted {"file_id":1}
```

## Stored Procedures Requeridos

### sp_File_setStoreFile
```sql
CREATE PROCEDURE sp_File_setStoreFile(
    IN p_path VARCHAR(255),
    IN p_filename VARCHAR(255)
)
BEGIN
    INSERT INTO files (path, filename, created_at, updated_at)
    VALUES (p_path, p_filename, NOW(), NOW());

    -- IMPORTANTE: Retornar el ID como 'idFile'
    SELECT LAST_INSERT_ID() as idFile;
END
```

### sp_User_setCreateUser
```sql
CREATE PROCEDURE sp_User_setCreateUser(
    IN p_firstname VARCHAR(50),
    IN p_secondname VARCHAR(50),
    IN p_lastname VARCHAR(100),
    IN p_username VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_file_id INT
)
BEGIN
    INSERT INTO users (
        firstname, secondname, lastname, username,
        email, password, file_id, created_at, updated_at
    ) VALUES (
        p_firstname, p_secondname, p_lastname, p_username,
        p_email, p_password, p_file_id, NOW(), NOW()
    );

    -- Retornar el usuario creado
    SELECT * FROM users WHERE id = LAST_INSERT_ID();
END
```

## Testing Recomendado

### Test 1: Usuario sin archivo
```bash
# Debería crear usuario con file_id = NULL
```

### Test 2: Usuario con archivo
```bash
# Debería crear archivo Y usuario
# Verificar: file existe en storage
# Verificar: registro en files tabla
# Verificar: usuario con file_id correcto
```

### Test 3: Error con archivo (email duplicado)
```bash
# Subir archivo
# Intentar crear usuario con email duplicado
# Verificar: NO existe archivo en storage
# Verificar: NO existe registro en files
# Verificar: Error 422 recibido
```

### Test 4: Archivo muy grande
```bash
# Subir archivo > 2MB
# Verificar: Error 422 antes de guardar
# Verificar: NO se creó nada
```

## Mejoras Futuras

1. **Queue Jobs** - Procesamiento asíncrono de archivos grandes
2. **Image Optimization** - Comprimir/redimensionar imágenes automáticamente
3. **Cloud Storage** - S3, CloudFlare R2 en lugar de local storage
4. **Thumbnails** - Generar miniaturas automáticamente
5. **Virus Scanning** - Escanear archivos subidos
6. **Soft Deletes** - Papelera de reciclaje para archivos eliminados
