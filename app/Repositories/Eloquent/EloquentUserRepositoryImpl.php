<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;

class EloquentUserRepositoryImpl implements UserRepositoryInterface
{
    /**
     * Get list of users with optional filters using stored procedure
     *
     * @param array $filters
     * @return array
     */
    public function getListUsers(array $filters = []): array
    {
        $id = $filters['id'] ?? 0;
        $name = $filters['name'] ?? '';
        $username = $filters['username'] ?? '';
        $email = $filters['email'] ?? '';
        $state = $filters['state'] ?? '';

        //DB::statement("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

        $results = DB::select('call sp_User_getListUsers (?, ?, ?, ?, ?)', [
            $id,
            $name,
            $username,
            $email,
            $state
        ]);

        return $results;
    }

    /**
     * Find user by ID
     *
     * @param int $id
     * @return object|null
     */
    public function findById(int $id): ?object
    {
        $results = DB::select('CALL sp_User_getUserById(?)', [$id]);

        // Stored procedure retorna array, tomamos el primer elemento
        return $results[0] ?? null;
    }
    public function create(array $data): object
    {
        $firstname = $data['firstname'] ?? '';
        $secondname = $data['secondname'] ?? '';
        $lastname = $data['lastname'] ?? '';
        $username = $data['username'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $fileId = $data['file_id'] ?? null;

        DB::statement("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

        // Call stored procedure to create user
        $result = DB::select('CALL sp_User_setCreateUser (?, ?, ?, ?, ?, ?, ?)', [
            $firstname,
            $secondname,
            $lastname,
            $username,
            $email,
            $password,
            $fileId
        ]);

        return $result[0] ?? (object)$data;
    }
    public function update(int $id, array $data): bool
    {
        $firstname = $data['firstname'] ?? '';
        $secondname = $data['secondname'] ?? '';
        $lastname = $data['lastname'] ?? '';
        $username = $data['username'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? null; // NULL si no se proporciona
        $fileId = $data['file_id'] ?? null;

        DB::statement("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

        // Call stored procedure to update user
        $result = DB::select('CALL sp_User_setUpdateUser (?, ?, ?, ?, ?, ?, ?, ?)', [
            $id,
            $firstname,
            $secondname,
            $lastname,
            $username,
            $email,
            $password,
            $fileId
        ]);

        // Si el stored procedure retorna algo, significa que se actualizó
        return !empty($result);
    }

    public function delete(int $id): bool
    {
        // TODO: Implement using stored procedure or Eloquent
        return true;
    }

    public function changeState(int $id, string $state): bool
    {
        // TODO: Implement using stored procedure or Eloquent
        return true;
    }
}
