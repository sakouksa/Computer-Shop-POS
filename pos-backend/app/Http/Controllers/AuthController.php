<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Contracts\Providers\JWT;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    // Register a new user
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable',
            'address' => 'nullable',
            'type' => 'nullable',
            'image' => 'nullable|image|mimes:jpeg,png,gif|max:5120',
        ]);
        //create the user
        $user = User::create([
            'name' => $request->name, //body json client $request->name | $request->input('name')
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        //Handle the image upload if exist
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('profile', 'public');
        }
        //create the profile
        $user->profile()->create([
            'phone' => $request->phone,
            'address' => $request->address,
            'image' => $imagePath,
            'type' => $request->type,
        ]);

        return response()->json([
            'user' => $user->load('profile'),
            'message' => 'Register successfully ',
        ], 201);
    }

    // Login a user and return a JWT token
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Attempt to verify the credentials and create a token
        if (!$token = JWTAuth::attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
//        Download User and Load Profile
        $user = JWTAuth::user();
        $user->load('profile');
        //Using DB Facade (Raw Query)
        $sqlpermission = "
        SELECT p.*
        FROM permissions p
        INNER JOIN permission_role rp ON p.id = rp.permission_id
        INNER JOIN roles r ON rp.role_id = r.id
        INNER JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = ? ";
        $permissions = DB::select($sqlpermission, [$user->id]);

        $payload = [
            "user" => $user,
            "permissions" => $permissions,
        ];
        $token = JWTAuth::claims($payload)->fromUser(JWTAuth::user()); // token payload
        return response()->json([
            'access_token' => $token,
            'user' => $user,
            'permission' => $permissions,
            'message' => 'Login successfully',
        ]);
    }
}
