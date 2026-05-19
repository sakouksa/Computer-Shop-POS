<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ProfileController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:api'),
        ];
    }

    // Get Current User Profile (Show Data)
    public function index()
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(["message" => "Unauthorized"], 401);
        }

        return response()->json([
            "data" => $user->load('profile')
        ], 200);
    }

    // Update Profile Information and Image
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|nullable|string',
            'address' => 'sometimes|nullable|string',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "errors" => $validator->errors()
            ], 422);
        }

        // Update User Table
        if ($request->has('name')) {
            $user->update(['name' => $request->name]);
        }

        // Prepare Profile Data
        $profileData = $request->only(['phone', 'address']);

        // Handle Image Upload
        if ($request->hasFile('image')) {
            if ($user->profile && $user->profile->image) {
                Storage::disk('public')->delete($user->profile->image);
            }
            $profileData['image'] = $request->file('image')->store('profile', 'public');
        }

        // Handle Manual Image Removal
        if ($request->image_remove === "true") {
            if ($user->profile && $user->profile->image) {
                Storage::disk('public')->delete($user->profile->image);
                $profileData['image'] = null;
            }
        }

        // 3. Update or Create Profile (Relationship)
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        return response()->json([
            "message" => "Update Profile Success",
            "data" => $user->load('profile')
        ], 200);
    }

    // Change Password Logic
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "errors" => $validator->errors()
            ], 422);
        }

        $user = auth('api')->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                "message" => "Old password incorrect"
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            "message" => "Password changed successfully"
        ], 200);
    }
}
