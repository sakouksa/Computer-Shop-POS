<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Public Routes (មិនបាច់មាន Token ក៏ចូលប្រើបាន)
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


// Protected Routes (ត្រូវមាន JWT Token ទើបអាចប្រើបាន)
// យើងប្រើ middleware('auth:api') សម្រាប់ JWT
Route::middleware('auth:api')->group(function () {

    // យកព័ត៌មាន User ដែលកំពុង Login
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Manage Route
    Route::apiResource('role', RoleController::class);
    Route::post('role/changeStatus/{id}', [RoleController::class, 'changeStatus']);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('province', ProvinceController::class)->withoutMiddleware('auth:api');
    Route::apiResource('customer', CustomerController::class);
    Route::apiResource('brand', BrandController::class);
    Route::apiResource('about', AboutController::class);

    // ចេញពីប្រព័ន្ធ
    Route::post('logout', [AuthController::class, 'logout']);
});