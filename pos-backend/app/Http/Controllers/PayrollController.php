<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use App\Http\Requests\StorePayrollRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PayrollController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for permissions
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:payroll.view', only: ['index']),
            new Middleware('permission:payroll.viewone', only: ['show']),
            new Middleware('permission:payroll.create', only: ['store']),
            new Middleware('permission:payroll.update', only: ['update']),
            new Middleware('permission:payroll.delete', only: ['destroy']),
        ];
    }

    /**
     * Get list of payrolls with search and filter
     */
    public function index(Request $req)
    {
        $query = Payroll::query();

        // Search by title
        if ($req->has('txt_search')) {
            $search = $req->input('txt_search');
            $query->where("title", "LIKE", "%$search%");
        }

        // Filter by status
        if ($req->has('status')) {
            $query->where("status", $req->input('status'));
        }

        $list = $query->with('details')->orderBy("id", "desc")->get();

        return response()->json([
            'list' => $list,
            'total' => $list->count(),
        ]);
    }

    /**
     * Store a new payroll
     */
    public function store(StorePayrollRequest $request)
    {
        $data = $request->validated();

        // Assign current user ID as creator
        $data['created_by'] = auth()->id();

        $payroll = Payroll::create($data);

        return response()->json([
            "data" => $payroll,
            'message' => 'Payroll created successfully',
        ], 201);
    }

    /**
     * Show single payroll with details
     */
    public function show(string $id)
    {
        $payroll = Payroll::with('details')->find($id);

        if (!$payroll) {
            return response()->json(['message' => 'Payroll not found'], 404);
        }

        return response()->json(["data" => $payroll]);
    }

    /**
     * Update existing payroll
     */
    public function update(StorePayrollRequest $request, string $id)
    {
        $payroll = Payroll::find($id);
        if (!$payroll) {
            return response()->json(['message' => 'Payroll not found'], 404);
        }

        $data = $request->validated();
        $payroll->update($data);

        return response()->json([
            "data" => $payroll,
            'message' => 'Payroll updated successfully',
        ], 200);
    }

    /**
     * Remove the specified payroll
     */
    public function destroy(string $id)
    {
        $payroll = Payroll::find($id);
        if (!$payroll) {
            return response()->json(['message' => 'Payroll not found'], 404);
        }

        $payroll->delete();

        return response()->json(['message' => 'Payroll deleted successfully'], 200);
    }
}
