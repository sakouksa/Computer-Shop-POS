<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Models\Customer;
use App\Models\CustomerType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CustomerController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:customer.view', only: ['index']),
            new Middleware('permission:customer.view_single', only: ['show']),
            new Middleware('permission:customer.create', only: ['store']),
            new Middleware('permission:customer.update', only: ['update']),
            new Middleware('permission:customer.delete', only: ['destroy']),
        ];
    }

    /**
     * Get all customers with search and filter functionality
     */
    public function index(Request $req)
    {
        // Eloquent ORM Query with CustomerType relationship loading
        $query = Customer::with('customerType');

        // Search by first_name, last_name, or telephone number
        if ($req->has("txt_search") && $req->input("txt_search") !== "") {
            $search = $req->input("txt_search");
            $query->where(function ($q) use ($search) {
                $q->where("first_name", "LIKE", "%{$search}%")
                    ->orWhere("last_name", "LIKE", "%{$search}%")
                    ->orWhere("tel", "LIKE", "%{$search}%");
            });
        }

        // Filter by specific customer type levels (General, Silver, Gold, Platinum)
        if ($req->input("customer_type_id") !== null && $req->input("customer_type_id") !== "") {
            $query->where("customer_type_id", $req->input("customer_type_id"));
        }

        $list = $query->orderBy('id', 'desc')->get();
        $total = $query->count();

        return response()->json([
            'list' => $list,
            'total' => $total,
            'customer_types' => CustomerType::all() // Sent to populate frontend select dropdowns
        ]);
    }

    /**
     * Store a new customer into the database
     */
    public function store(StoreCustomerRequest $request)
    {
        $payload = $request->validated();
        $payload['created_by'] = auth()->id() ?? 1; // Fallback to user ID 1 if auth is not yet set up

        $data = Customer::create($payload);

        if (!$data) {
            return response()->json([
                'error' => [
                    'message' => 'Failed to add new customer data.',
                ],
            ], 500);
        }

        return response()->json([
            'data' => $data->load('customerType'),
            'message' => 'Customer created successfully.',
        ], 201);
    }

    /**
     * Get a single customer record by ID
     */
    public function show(string $id)
    {
        $customer = Customer::with('customerType')->find($id);

        if (!$customer) {
            return response()->json([
                'message' => 'Customer record not found.'
            ], 404);
        }

        return response()->json([
            'data' => $customer,
        ]);
    }

    /**
     * Update an existing customer profile record
     */
    public function update(StoreCustomerRequest $request, string $id)
    {
        $data = Customer::find($id);

        if (!$data) {
            return response()->json([
                'message' => 'Customer record not found.'
            ], 404);
        }

        $data->update($request->validated());

        return response()->json([
            'data' => $data->load('customerType'),
            'message' => 'Customer information updated successfully.',
        ]);
    }

    /**
     * Delete a customer from the database
     */
    public function destroy(string $id)
    {
        $data = Customer::find($id);

        if (!$data) {
            return response()->json([
                'message' => 'Customer record not found.'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'message' => 'Customer deleted successfully.',
        ]);
    }
}
