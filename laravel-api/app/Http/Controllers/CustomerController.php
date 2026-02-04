<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'list' => Customer::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CustomerRequest $request)
    {
        $data = Customer::create($request->validated());
        if (! $data) {
            return response()->json([
                'error' => [
                    'message' => 'Insert Customer Failed',
                ],
            ], 500);
        }

        return response()->json([
            'data' => $data,
            'message' => 'Insert Customer Successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json([
            'data' => Customer::find($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CustomerRequest $request, string $id)
    {
        $data = Customer::findOrFail($id);
        $data->update($request->validated());

        return response()->json([
            'data' => $data,
            'message' => 'Update Customer Successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Customer::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'Delete Customer Successfully',
        ]);
    }
}
