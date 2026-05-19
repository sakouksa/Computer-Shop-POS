<?php

namespace App\Http\Controllers;

use App\Models\ExpenseType;
use App\Http\Requests\StoreExpenseTypeRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ExpenseTypeController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for permissions based on your route list
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:expense-type.view', only: ['index']),
            new Middleware('permission:expense-type.viewone', only: ['show']),
            new Middleware('permission:expense-type.create', only: ['store']),
            new Middleware('permission:expense-type.update', only: ['update']),
            new Middleware('permission:expense-type.delete', only: ['destroy']),
        ];
    }

    /**
     * Get list of expense types with search
     */
    public function index(Request $request)
    {
        $query = ExpenseType::query();

        // Search by name or description
        if ($request->has('txt_search')) {
            $search = $request->input('txt_search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $list = $query->orderBy('id', 'desc')->get();
        $total = $query->count();

        return response()->json([
            "list" => $list,
            "total" => $total
        ]);
    }

    /**
     * Store a new expense type
     */
    public function store(StoreExpenseTypeRequest $request)
    {
        $data = $request->validated();
        $expenseType = ExpenseType::create($data);

        return response()->json([
            "data" => $expenseType,
            "message" => "Expense type created successfully"
        ], 201);
    }

    /**
     * Show single record
     */
    public function show(string $id)
    {
        $expenseType = ExpenseType::find($id);

        if (!$expenseType) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json(["data" => $expenseType]);
    }

    /**
     * Update existing expense type
     */
    public function update(StoreExpenseTypeRequest $request, string $id)
    {
        $expenseType = ExpenseType::find($id);

        if (!$expenseType) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $data = $request->validated();
        $expenseType->update($data);

        return response()->json([
            "data" => $expenseType,
            "message" => "Expense type updated successfully"
        ], 200);
    }

    /**
     * Remove the specified record
     */
    public function destroy(string $id)
    {
        $expenseType = ExpenseType::find($id);

        if (!$expenseType) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        // Check if there are expenses linked to this type before deleting
        if ($expenseType->expenses()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete: This type is being used in expenses'
            ], 400);
        }

        $expenseType->delete();

        return response()->json(['message' => 'Record deleted successfully'], 200);
    }
}
