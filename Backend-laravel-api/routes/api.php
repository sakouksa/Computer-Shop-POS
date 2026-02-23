<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
// route role
// localhost:8000/api/role , method get
Route::apiResource('role', RoleController::class);
// change status role
Route::post('role/changeStatus/{id}', [RoleController::class, 'changeStatus']);
// Category Routes
Route::apiResource('categories', CategoryController::class);
// Province Route
Route::apiResource('province', ProvinceController::class);

// Customer Routes
Route::apiResource('customer', CustomerController::class);
// About Routes
Route::apiResource('about', AboutController::class);

//Auth
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);