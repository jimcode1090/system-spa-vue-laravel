<?php

namespace App\Services;

use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserService
{
    protected UserRepositoryInterface $userRepository;
    protected FileService $fileService;

    public function __construct(
        UserRepositoryInterface $userRepository,
        FileService $fileService
    ) {
        $this->userRepository = $userRepository;
        $this->fileService = $fileService;
    }

    /**
     * Get list of users with optional filters
     *
     * @param array $filters
     * @return array
     */
    public function getListUsers(array $filters = []): array
    {
        // Business logic can go here (e.g., logging, caching, data transformation)
        return $this->userRepository->getListUsers($filters);
    }

    /**
     * Get user by ID
     *
     * @param int $id
     * @return object|null
     */
    public function getUserById(int $id): ?object
    {
        return $this->userRepository->findById($id);
    }

    /**
     * Create user
     *
     * @param array $data
     * @param UploadedFile|null $file
     * @return object
     * @throws \Throwable
     */
    public function createUser(array $data, ?UploadedFile $file = null): object
    {
        $fileId = null;

        DB::beginTransaction();

        try {
            if ($file) {
                $fileId = $this->fileService->storeFile($file, 'uploads/users');
                if (!$fileId || $fileId <= 0) {
                    throw new \RuntimeException('El archivo no se pudo guardar correctamente');
                }
            }

            $data['password'] = Hash::make($data['password']);
            $data['file_id'] = $fileId;
            $user = $this->userRepository->create($data);

            DB::commit();
            return $user;

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error creating user', [
                'error' => $e->getMessage(),
                'file_id' => $fileId
            ]);

            // If file was uploaded, delete it from filesystem
            if ($fileId && $fileId > 0) {
                try {
                    $this->fileService->deleteFile($fileId);
                    Log::info('Rolled back: File deleted', ['file_id' => $fileId]);
                } catch (\Exception $deleteError) {
                    Log::error('Error deleting file during rollback', [
                        'file_id' => $fileId,
                        'error' => $deleteError->getMessage()
                    ]);
                }
            }

            // Re-throw the exception
            throw $e;
        }
    }

    /**
     * Update user information
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function updateUser(int $id, array $data): bool
    {
        // Add business logic here
        return $this->userRepository->update($id, $data);
    }

    /**
     * Delete user
     *
     * @param int $id
     * @return bool
     */
    public function deleteUser(int $id): bool
    {
        return $this->userRepository->delete($id);
    }

    /**
     * Change user state (activate/deactivate)
     *
     * @param int $id
     * @param string $state
     * @return bool
     */
    public function changeUserState(int $id, string $state): bool
    {
        // Validate state
        if (!in_array($state, ['A', 'I'])) {
            throw new \InvalidArgumentException('Invalid state. Must be A or I.');
        }

        return $this->userRepository->changeState($id, $state);
    }
}
