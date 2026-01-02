<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getListUsers(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $name = $request->input('name');
        $username = $request->input('username');
        $email = $request->input('email');
        $state = $request->input('state');

        $name = ($name == null) ? ($name = '') : $name;
        $username = ($username == null) ? ($username = '') : $username;
        $email = ($email == null) ? ($email = '') : $email;
        $state = ($state == null) ? ($state = '') : $state;

         DB::statement("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

        $resp = DB::select('call sp_User_getListUsers (?, ?, ?, ?)', [
            $name, $username, $email, $state
        ]);

        return $resp;

    }
}
