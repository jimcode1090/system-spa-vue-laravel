<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/{optional?}', function () {
    return view('app');
})->name('basepath');

Route::get('/admin/users/get-list-users', [UserController::class, 'getListUsers']);
