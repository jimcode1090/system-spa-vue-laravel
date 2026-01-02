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
        $name = $filters['name'] ?? '';
        $username = $filters['username'] ?? '';
        $email = $filters['email'] ?? '';
        $state = $filters['state'] ?? '';

        //DB::statement("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

        $results = DB::select('call sp_User_getListUsers (?, ?, ?, ?)', [
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
        // TODO: Implement using stored procedure or Eloquent
        return null;
    }

    /**
     * Create a new user
     *
     * @param array $data
     * @return object
     */
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

    /**
     * Update user
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool
    {
        // TODO: Implement using stored procedure or Eloquent
        return true;
    }

    /**
     * Delete user (soft delete)
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        // TODO: Implement using stored procedure or Eloquent
        return true;
    }

    /**
     * Change user state (activate/deactivate)
     *
     * @param int $id
     * @param string $state
     * @return bool
     */
    public function changeState(int $id, string $state): bool
    {
        // TODO: Implement using stored procedure or Eloquent
        return true;
    }
}
