<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerTypeRequest;
use App\Models\CustomerType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CustomerTypeController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:customer-type.view', only: ['index']),
            new Middleware('permission:customer-type.viewone', only: ['show']),
            new Middleware('permission:customer-type.create', only: ['store']),
            new Middleware('permission:customer-type.update', only: ['update']),
            new Middleware('permission:customer-type.delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of customer types with filtered search on name only.
     */
    public function index(Request $req)
    {
        $query = CustomerType::query();

        // Search condition restricted purely to the 'name' column
        if ($req->has("txt_search") && $req->input("txt_search") !== "") {
            $search = $req->input("txt_search");
            $query->where("name", "LIKE", "%{$search}%");
        }

        $list = $query->orderBy('id', 'desc')->get();
        $total = $query->count();

        return response()->json([
            'list' => $list,
            'total' => $total,
        ]);
    }

    /**
     * Store a newly created customer type in storage using Form Request validation.
     */
    public function store(StoreCustomerTypeRequest $request)
    {
        // Data automatically passes validation before entering here
        $validatedData = $request->validated();

        $data = CustomerType::create($validatedData);

        if (!$data) {
            return response()->json([
                'error' => [
                    'message' => 'Failed to create new customer type profile.',
                ],
            ], 500);
        }

        return response()->json([
            'data' => $data,
            'message' => 'Customer type created successfully.',
        ], 201);
    }

    /**
     * Display the specified customer type profile.
     */
    public function show(string $id)
    {
        $customerType = CustomerType::find($id);

        if (!$customerType) {
            return response()->json([
                'message' => 'Customer type record not found.'
            ], 404);
        }

        return response()->json([
            'data' => $customerType,
        ]);
    }

    /**
     * Update the specified customer type record in storage using Form Request validation.
     */
    public function update(StoreCustomerTypeRequest $request, string $id)
    {
        $customerType = CustomerType::find($id);

        if (!$customerType) {
            return response()->json([
                'message' => 'Customer type record not found.'
            ], 404);
        }

        // Extracts validated payload details directly from your custom rule schema
        $validatedData = $request->validated();

        $customerType->update($validatedData);

        return response()->json([
            'data' => $customerType,
            'message' => 'Customer type updated successfully.',
        ]);
    }

    /**
     * Remove the specified customer type profile from storage.
     */
    public function destroy(string $id)
    {
        $customerType = CustomerType::find($id);

        if (!$customerType) {
            return response()->json([
                'message' => 'Customer type record not found.'
            ], 404);
        }

        $customerType->delete();

        return response()->json([
            'message' => 'Customer type deleted successfully.',
        ]);
    }
}
