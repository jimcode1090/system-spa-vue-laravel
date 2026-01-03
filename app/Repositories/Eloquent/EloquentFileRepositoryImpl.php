<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\FileRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EloquentFileRepositoryImpl implements FileRepositoryInterface
{
    public function store(UploadedFile $file, ?string $folder = null): int
    {
        // Store file in Laravel storage (public disk)
        $folder = $folder ?? 'uploads/users';
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs($folder, $filename, 'public');
        $result = DB::select('CALL sp_File_setStoreFile (?, ?)', [
            $path,
            $file->getClientOriginalName()
        ]);
        return $result[0]->idFile ?? 0;
    }

    /**
     * Get file by ID
     *
     * @param int $id
     * @return object|null
     */
    public function findById(int $id): ?object
    {
        DB::statement("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

        $result = DB::select('CALL sp_File_getFileById (?)', [$id]);

        return $result[0] ?? null;
    }

    /**
     * Delete file by ID
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        // Get file info first
        $file = $this->findById($id);

        if (!$file) {
            return false;
        }

        // Delete physical file from storage
        if (isset($file->path) && Storage::disk('public')->exists($file->path)) {
            Storage::disk('public')->delete($file->path);
        }

        // Delete from database
        DB::statement("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
        DB::select('CALL sp_File_deleteFile (?)', [$id]);

        return true;
    }
}
