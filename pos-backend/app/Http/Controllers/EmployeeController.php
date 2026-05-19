<?php

namespace App\Http\Controllers;

use App\Exports\EmployeeExport;
use App\Models\Employee;
use App\Http\Requests\StoreEmployeeRequest;
use App\Models\PaymentMethod;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeController extends Controller implements HasMiddleware
{
    public function export()
    {
        return Excel::download(new EmployeeExport, 'Employee_List.xlsx');
    }

    /**
     * Define middleware for the controller based on permissions.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:employee.view', only: ['index', 'show']),
            new Middleware('permission:employee.viewone', only: ['show']),
            new Middleware('permission:employee.create', only: ['store']),
            new Middleware('permission:employee.update', only: ['update']),
            new Middleware('permission:employee.delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of employees with search and status filters.
     */
    public function index(Request $request)
    {
        $query = Employee::with(['position', 'paymentMethod']);

        if ($request->has('txt_search')) {
            $search = $request->input('txt_search');
            $query->where(function ($q) use ($search) {
                $q->where("first_name", "LIKE", "%$search%")
                    ->orWhere("last_name", "LIKE", "%$search%")
                    ->orWhere("card_id", "LIKE", "%$search%")
                    ->orWhere("email", "LIKE", "%$search%");
            });
        }
        if ($request->has('position_id')) {
            $query->where('position_id', $request->input('position_id'));
        }

        if ($request->has('employment_status')) {
            $query->where('employment_status', $request->employment_status);
        }

        $list = $query->orderBy("id", "desc")->get();

        return response()->json([
            'list' => $list,
            'total' => $list->count(),
            'positions' => Position::all(),
            'payment_methods' => PaymentMethod::all(),
        ]);
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('employees', 'public');
        }

        $employee = Employee::create($data);

        return response()->json([
            "data" => $employee,
            'message' => 'Employee created successfully',
        ], 201);
    }

    /**
     * Display the specified employee.
     */
    public function show(string $id)
    {
        $employee = Employee::with(['position', 'paymentMethod'])->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json(["data" => $employee]);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(StoreEmployeeRequest $request, string $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $data = $request->validated();
        $imagePath = $employee->image;

        // Handle Image Update Logic
        if ($request->hasFile('image')) {
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }
            $imagePath = $request->file('image')->store('employees', 'public');
        } else if ($request->image_remove == "true") {
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }
            $imagePath = null;
        }

        $data['image'] = $imagePath;
        $employee->update($data);

        return response()->json([
            "data" => $employee,
            'message' => 'Employee updated successfully',
        ], 200);
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(string $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        // Delete image from storage before deleting record
        if ($employee->image) {
            Storage::disk('public')->delete($employee->image);
        }

        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully'], 200);
    }
}
