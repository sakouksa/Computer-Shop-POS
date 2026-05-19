<?php

namespace App\Http\Controllers;

use App\Exports\ProductExport;
use App\Models\Employee;
use App\Models\EmployeePayroll;
use App\Http\Requests\StoreEmployeePayrollRequest;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Maatwebsite\Excel\Facades\Excel;

class EmployeePayrollController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for permissions
     * Uses unique permissions for individual employee payroll management
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:employee-payroll.view', only: ['index']),
            new Middleware('permission:employee-payroll.viewone', only: ['show']),
            new Middleware('permission:employee-payroll.create', only: ['store']),
            new Middleware('permission:employee-payroll.update', only: ['update']),
            new Middleware('permission:employee-payroll.delete', only: ['destroy']),
            new Middleware('permission:employee-payroll.approve', only: ['approve']),
            new Middleware('permission:employee-payroll.export', only: ['export']),
        ];
    }

    public function export()
    {
        return Excel::download(new ProductExport, 'Employee-Payroll_List.xlsx');
    }
    /**
     * Get list of employee payrolls with search and filter
     */
// Get list of employee payrolls with search and filter (similar to product index)
    public function index(Request $request)
    {
        $query = EmployeePayroll::query();

        // Filter by ID
        if ($request->has('id')) {
            $query->where('id', $request->input('id'));
        }

        // Filter by payroll batch
        if ($request->has('payroll_id')) {
            $query->where('payroll_id', $request->input('payroll_id'));
        }

        // Filter by employee
        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->input('employee_id'));
        }

        // Search by employee name
        if ($request->has('txt_search')) {
            $search = $request->input('txt_search');

            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                    ->orWhere('last_name', 'LIKE', "%{$search}%");
            });
        }

        // Get payroll list with relationships
        $list = $query->with(['employee', 'payroll'])
            ->orderBy('id', 'desc')
            ->get();

        // Total count
        $total = $query->count();

        return response()->json([
            "list" => $list,
            "total" => $total,
            "employee" => Employee::all(),
            "payroll" => Payroll::all(),
        ]);
    }

    /**
     * Store a new employee payroll entry
     */
    public function store(StoreEmployeePayrollRequest $request)
    {
        $data = $request->validated();

        // --- Calculation Logic for net_salary (Matches Database Migration) ---
        // Formula: (Base Salary + OT + Allowance) - Deduction
        $base = $data['base_salary'];
        $ot = $data['ot_amount'] ?? 0;
        $allowance = $data['allowance'] ?? 0;
        $deduction = $data['deduction_amount'] ?? 0;

        $data['net_salary'] = ($base + $ot + $allowance) - $deduction;

        $employeePayroll = EmployeePayroll::create($data);

        return response()->json([
            "data" => $employeePayroll,
            'message' => 'Employee payroll entry created successfully',
        ], 201);
    }

    /**
     * Show single record with details
     */
    public function show(string $id)
    {
        $employeePayroll = EmployeePayroll::with(['employee', 'payroll'])->find($id);

        if (!$employeePayroll) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json(["data" => $employeePayroll]);
    }

    /**
     * Update existing employee payroll entry
     */
    public function update(StoreEmployeePayrollRequest $request, string $id)
    {
        $employeePayroll = EmployeePayroll::find($id);
        if (!$employeePayroll) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $data = $request->validated();

        // --- Re-calculate net_salary upon update ---
        $base = $data['base_salary'];
        $ot = $data['ot_amount'] ?? 0;
        $allowance = $data['allowance'] ?? 0;
        $deduction = $data['deduction_amount'] ?? 0;

        $data['net_salary'] = ($base + $ot + $allowance) - $deduction;

        $employeePayroll->update($data);

        return response()->json([
            "data" => $employeePayroll,
            'message' => 'Employee payroll updated successfully',
        ], 200);
    }

    /**
     * Remove the specified record
     */
    public function destroy(string $id)
    {
        $employeePayroll = EmployeePayroll::find($id);
        if (!$employeePayroll) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $employeePayroll->delete();

        return response()->json(['message' => 'Record deleted successfully'], 200);
    }
}
