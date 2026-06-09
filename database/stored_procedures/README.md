# Stored Procedures - Módulo de Usuarios

## Archivos

- `sp_User_getUserById.sql` - Obtiene usuario por ID
- `sp_User_setUpdateUser.sql` - Actualiza usuario (password y file_id opcionales)

## Instalación

Ejecutar en MySQL:

```bash
mysql -u usuario -p base_de_datos < database/stored_procedures/sp_User_getUserById.sql
mysql -u usuario -p base_de_datos < database/stored_procedures/sp_User_setUpdateUser.sql
```

O desde Laravel Tinker:

```php
DB::unprepared(file_get_contents(database_path('stored_procedures/sp_User_getUserById.sql')));
DB::unprepared(file_get_contents(database_path('stored_procedures/sp_User_setUpdateUser.sql')));
```

## Notas

- **Password NULL** = No actualizar contraseña
- **File_id NULL** = No actualizar archivo
- Los stored procedures incluyen `DROP PROCEDURE IF EXISTS`
