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
     * Características:
     * - Password es opcional (solo se actualiza si se proporciona)
     * - File es opcional (solo se actualiza si se proporciona)
     * - Si se sube un nuevo archivo, el antiguo se mantiene hasta que la transacción sea exitosa
     * - Usa transacciones para garantizar atomicidad
     *
     * @param int $id
     * @param array $data
     * @param UploadedFile|null $file
     * @return object
     * @throws \Throwable
     */
    public function updateUser(int $id, array $data, ?UploadedFile $file = null): object
    {
        $newFileId = null;
        $oldFileId = null;

        // Obtener el usuario actual para saber si tiene un archivo previo
        $currentUser = $this->userRepository->findById($id);
        if (!$currentUser) {
            throw new \RuntimeException('Usuario no encontrado');
        }

        $oldFileId = $currentUser->profile_image ?? null;

        DB::beginTransaction();

        try {
            // 1. Si se proporcionó un nuevo archivo, subirlo
            if ($file) {
                $newFileId = $this->fileService->storeFile($file, 'uploads/users');
                if (!$newFileId || $newFileId <= 0) {
                    throw new \RuntimeException('El archivo no se pudo guardar correctamente');
                }
                $data['file_id'] = $newFileId;
            }

            // 2. Si se proporcionó password, hashearla. Si no, no actualizar password
            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                // No actualizar password si no se proporcionó
                unset($data['password']);
            }

            // 3. Actualizar usuario
            $updated = $this->userRepository->update($id, $data);

            if (!$updated) {
                throw new \RuntimeException('No se pudo actualizar el usuario');
            }

            // 4. Si todo salió bien, eliminar el archivo antiguo si había uno nuevo
            if ($newFileId && $oldFileId && $oldFileId > 0) {
                try {
                    $this->fileService->deleteFile($oldFileId);
                    Log::info('Old file deleted after successful update', [
                        'old_file_id' => $oldFileId,
                        'new_file_id' => $newFileId
                    ]);
                } catch (\Exception $deleteError) {
                    // No hacer rollback si solo falla la eliminación del archivo antiguo
                    Log::warning('Could not delete old file, but update was successful', [
                        'old_file_id' => $oldFileId,
                        'error' => $deleteError->getMessage()
                    ]);
                }
            }

            DB::commit();

            // Retornar usuario actualizado
            return $this->userRepository->findById($id);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating user', [
                'user_id' => $id,
                'error' => $e->getMessage(),
                'new_file_id' => $newFileId
            ]);

            // Si se subió un archivo nuevo durante esta transacción, eliminarlo
            if ($newFileId && $newFileId > 0) {
                try {
                    $this->fileService->deleteFile($newFileId);
                    Log::info('Rolled back: New file deleted', ['file_id' => $newFileId]);
                } catch (\Exception $deleteError) {
                    Log::error('Error deleting new file during rollback', [
                        'file_id' => $newFileId,
                        'error' => $deleteError->getMessage()
                    ]);
                }
            }

            // Re-throw the exception
            throw $e;
        }
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
