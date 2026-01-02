<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

/**
 * API Responser Trait
 *
 * Standardizes all API responses with consistent format
 *
 * Response Structure:
 * {
 *   "success": true/false,
 *   "message": "mensaje descriptivo",
 *   "data": {...} o null,
 *   "errors": {...} o null,
 *   "meta": {...} o null
 * }
 */
trait ApiResponser
{
    /**
     * Build standardized JSON response
     *
     * @param bool $success
     * @param string $message
     * @param mixed $data
     * @param int $code
     * @param array|null $errors
     * @param array|null $meta
     * @return JsonResponse
     */
    protected function jsonResponse(
        bool $success,
        string $message,
        $data = null,
        int $code = 200,
        ?array $errors = null,
        ?array $meta = null
    ): JsonResponse {
        $response = [
            'success' => $success,
            'message' => $message,
            'data' => $data,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        if ($meta) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $code);
    }

    /**
     * Success response
     *
     * @param mixed $data
     * @param string $message
     * @param int $code
     * @param array|null $meta
     * @return JsonResponse
     */
    protected function successResponse(
        $data = null,
        string $message = 'Operación exitosa',
        int $code = 200,
        ?array $meta = null
    ): JsonResponse {
        return $this->jsonResponse(true, $message, $data, $code, null, $meta);
    }

    /**
     * Error response
     *
     * @param string $message
     * @param int $code
     * @param array|null $errors
     * @param mixed $data
     * @return JsonResponse
     */
    protected function errorResponse(
        string $message = 'Ha ocurrido un error',
        int $code = 400,
        ?array $errors = null,
        $data = null
    ): JsonResponse {
        return $this->jsonResponse(false, $message, $data, $code, $errors);
    }

    /**
     * Server error response (500)
     *
     * @param string $message
     * @param \Exception|null $exception
     * @return JsonResponse
     */
    protected function serverErrorResponse(
        string $message = 'Error interno del servidor',
        ?\Exception $exception = null
    ): JsonResponse {
        $data = null;

        // Include exception details in development
        if (config('app.debug') && $exception) {
            $data = [
                'exception' => get_class($exception),
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ];
        }

        return $this->errorResponse($message, 500, null, $data);
    }
}

