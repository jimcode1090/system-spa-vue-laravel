<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/admin/users/get-list-users', [UserController::class, 'getListUsers']);
Route::post('/admin/users/create-users', [UserController::class, 'createUser']);

Route::get('/{optional?}', function () {
    return view('app');
})->name('basepath')
    ->where('optional', '.*');
