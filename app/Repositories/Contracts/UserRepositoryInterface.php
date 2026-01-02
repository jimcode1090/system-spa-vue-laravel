<?php

namespace App\Repositories\Contracts;

interface UserRepositoryInterface
{
    /**
     * Get list of users with optional filters
     *
     * @param array $filters
     * @return array
     */
    public function getListUsers(array $filters = []): array;

    /**
     * Find user by ID
     *
     * @param int $id
     * @return object|null
     */
    public function findById(int $id): ?object;

    /**
     * Create a new user
     *
     * @param array $data
     * @return object
     */
    public function create(array $data): object;

    /**
     * Update user
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete user (soft delete)
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Change user state
     *
     * @param int $id
     * @param string $state
     * @return bool
     */
    public function changeState(int $id, string $state): bool;
}
