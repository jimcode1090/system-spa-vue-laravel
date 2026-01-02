<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\CreateUserRequest;
use App\Http\Requests\Admin\User\ListUsersRequest;
use App\Services\UserService;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponser;

    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getListUsers(ListUsersRequest $request)
    {
        try {
            $filters = $request->validated();
            $users = $this->userService->getListUsers($filters);

            return $this->successResponse(
                $users,
                'Usuarios obtenidos exitosamente',
                200
            );
        } catch (\Exception $e) {
            return $this->serverErrorResponse(
                'Error al obtener la lista de usuarios',
                $e
            );
        }
    }

    public function createUser(CreateUserRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $file = $request->hasFile('file') ? $request->file('file') : null;
            unset($validatedData['file']);
            $user = $this->userService->createUser($validatedData, $file);

            return $this->successResponse(
                $user,
                'Usuario creado exitosamente',
                201
            );
        } catch (\Exception $e) {
            return $this->serverErrorResponse(
                'Error al crear el usuario',
                $e
            );
        }
    }
}
