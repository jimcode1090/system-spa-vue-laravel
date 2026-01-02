<?php

namespace App\Services;

use App\Repositories\Contracts\FileRepositoryInterface;
use Illuminate\Http\UploadedFile;

class FileService
{
    protected FileRepositoryInterface $fileRepository;

    public function __construct(FileRepositoryInterface $fileRepository)
    {
        $this->fileRepository = $fileRepository;
    }

    /**
     * Store uploaded file and return its ID
     *
     * @param UploadedFile $file
     * @param string|null $folder
     * @return int File ID
     */
    public function storeFile(UploadedFile $file, ?string $folder = null): int
    {
        // Delegate to repository
        return $this->fileRepository->store($file, $folder);
    }

    /**
     * Get file by ID
     *
     * @param int $id
     * @return object|null
     */
    public function getFileById(int $id): ?object
    {
        return $this->fileRepository->findById($id);
    }

    /**
     * Delete file
     *
     * @param int $id
     * @return bool
     */
    public function deleteFile(int $id): bool
    {
        return $this->fileRepository->delete($id);
    }
}
