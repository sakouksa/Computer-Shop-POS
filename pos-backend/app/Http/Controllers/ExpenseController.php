<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Models\Expense;
use App\Models\ExpenseType;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ExpenseController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:expense.view', only: ['index']),
            new Middleware('permission:expense.viewone', only: ['show']),
            new Middleware('permission:expense.create', only: ['store']),
            new Middleware('permission:expense.update', only: ['update']),
            new Middleware('permission:expense.delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $req)
    {
        $query = Expense::query();

        // Filter by ID
        if ($req->has('id')) {
            $query->where('id', $req->input('id'));
        }

        // Filter by expense type
        if ($req->has('expense_type_id')) {
            $query->where('expense_type_id', $req->input('expense_type_id'));
        }

        // Filter by status
        if ($req->has('expense_status')) {
            $query->where('expense_status', $req->input('expense_status'));
        }

        // Search by name or description
        if ($req->has('txt_search')) {
            $search = $req->input('txt_search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Get list with relationship
        $list = $query->with(['expenseType'])
            ->orderBy('id', 'desc')
            ->get();
        // Total count
        $total = $query->count();

        return response()->json([
            "list" => $list,
            "total" => $total,
            "expense_type" => ExpenseType::all(), // For dropdown in UI
        ]);
    }

    /**
     * Store a newly created expense
     */
    public function store(StoreExpenseRequest $request)
    {
        $data = $request->validated();

        $expense = Expense::create($data);

        return response()->json([
            "data" => $expense,
            'message' => 'Expense created successfully',
        ], 201);
    }

    /**
     * Display the specified expense
     */
    public function show(string $id)
    {
        $expense = Expense::with(['expenseType'])->find($id);

        if (!$expense) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json(["data" => $expense]);
    }

    /**
     * Update the specified expense
     */
    public function update(StoreExpenseRequest $request, string $id)
    {
        $expense = Expense::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $data = $request->validated();
        $expense->update($data);

        return response()->json([
            "data" => $expense,
            'message' => 'Expense updated successfully',
        ], 200);
    }

    /**
     * Remove the specified expense
     */
    public function destroy(string $id)
    {
        $expense = Expense::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully'], 200);
    }
}
