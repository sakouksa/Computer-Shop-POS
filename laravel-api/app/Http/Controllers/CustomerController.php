<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
class CustomerController extends Controller
{
    /**
     * Get all customers ordered by latest ID
     */
    public function index()
    {
        $list = Customer::orderBy('id', 'desc')->get();
        return response()->json([
            'list' => $list,
        ]);
    }

    /**
     * Store a new customer into database
     */
    public function store(CustomerRequest $request)
    {
        // Create new customer with validated data
        $data = Customer::create($request->validated());

        if (!$data) {
            return response()->json([
                'error' => [
                    'message' => 'ការបន្ថែមអតិថិជនបានបរាជ័យ',
                ],
            ], 500);
        }

        return response()->json([
            'data' => $data,
            'message' => 'បន្ថែមអតិថិជនបានជោគជ័យ',
        ]);
    }

    /**
     * Get a single customer by ID
     */
    public function show(string $id)
    {
        return response()->json([
            'data' => Customer::find($id),
        ]);
    }

    /**
     * Update existing customer information
     */
    public function update(CustomerRequest $request, string $id)
    {
        // Find customer or return 404
        $data = Customer::findOrFail($id);

        // Update with validated data
        $data->update($request->validated());

        return response()->json([
            'data' => $data,
            'message' => 'កែប្រែព័ត៌មានអតិថិជនបានជោគជ័យ',
        ]);
    }

    /**
     * Delete customer from database
     */
    public function destroy(string $id)
    {
        // Find customer or return 404
        $data = Customer::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'លុបអតិថិជនបានជោគជ័យ',
        ]);
    }
}