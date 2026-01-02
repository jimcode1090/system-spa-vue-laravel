<?php

namespace App\Repositories\Contracts;

use Illuminate\Http\UploadedFile;

interface FileRepositoryInterface
{
    /**
     * Store uploaded file and return its ID
     *
     * @param UploadedFile $file
     * @param string|null $folder
     * @return int File ID
     */
    public function store(UploadedFile $file, ?string $folder = null): int;

    /**
     * Get file by ID
     *
     * @param int $id
     * @return object|null
     */
    public function findById(int $id): ?object;

    /**
     * Delete file by ID
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;
}
