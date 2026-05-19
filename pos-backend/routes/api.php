<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeePayrollController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpenseTypeController;
use App\Http\Controllers\PaymentMethodeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected routes (require JWT authentication)
Route::middleware('auth:api')->group(function () {

    // Get logged_in user info
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    Route::get('user', [ProfileController::class, 'index']);
    Route::post('profile/update', [ProfileController::class, 'updateProfile']);
    Route::post('profile/change-password', [ProfileController::class, 'changePassword']);
    // Role routes
    Route::apiResource('role', RoleController::class);
    Route::post('role/changeStatus/{id}', [RoleController::class, 'changeStatus']);
    // Product routes
    Route::apiResource("products", ProductController::class);
    Route::get('product-export', [ProductController::class, 'export']);
    // Category routes
    Route::apiResource('categories', CategoryController::class);
    // Brand routes
    Route::apiResource('brands', BrandController::class);
    // Customer routes
    Route::apiResource('customer', CustomerController::class);
    // About routes
    Route::apiResource('about', AboutController::class);
    // Payment method routes
    Route::apiResource('payment_methods', PaymentMethodeController::class);
    // Position routes
    Route::apiResource('positions', PositionController::class);
    // Employee routes
    Route::apiResource('employees', EmployeeController::class);
    Route::get('employees-export', [EmployeeController::class, 'export']);
    // Payroll routes
    Route::apiResource('payrolls', PayrollController::class);
    // Employee payroll routes
    Route::apiResource('employee/payrolls', EmployeePayrollController::class);
    Route::get('employee-payroll-export', [EmployeePayrollController::class, 'export']);
    // expenses routes
    Route::apiResource('expenses', ExpenseController::class);
    // expense-types routes
    Route::apiResource('expense-types', ExpenseTypeController::class);
    // Province routes (public even inside auth group)
    Route::apiResource('province', ProvinceController::class)
        ->withoutMiddleware('auth:api');

    // Logout
    Route::post('logout', [AuthController::class, 'logout']);
});
