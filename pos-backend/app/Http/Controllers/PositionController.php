<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Http\Requests\StorePositionRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PositionController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the controller based on permissions.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:position.view', only: ['index']),
            new Middleware('permission:position.viewone', only: ['show']),
            new Middleware('permission:position.create', only: ['store']),
            new Middleware('permission:position.update', only: ['update']),
            new Middleware('permission:position.delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of positions with search and parent relationships.
     */
    public function index(Request $request)
    {
        // Eager load 'parent' to see the department/hierarchy level
        $query = Position::with('parent');

        // Search logic: Name or Description
        if ($request->has('txt_search')) {
            $search = $request->input('txt_search');
            $query->where(function ($q) use ($search) {
                $q->where("name", "LIKE", "%$search%")
                    ->orWhere("description", "LIKE", "%$search%");
            });
        }

        $list = $query->orderBy("id", "desc")->get();

        return response()->json([
            'list' => $list,
            'total' => $list->count(),
        ]);
    }

    /**
     * Store a newly created position in storage.
     */
    public function store(StorePositionRequest $request)
    {
        $data = $request->validated();
        $position = Position::create($data);

        return response()->json([
            "data" => $position,
            'message' => 'Position created successfully',
        ], 201);
    }

    /**
     * Display the specified position with its children and employees.
     */
    public function show(string $id)
    {
        $position = Position::with(['parent', 'children', 'employees'])->find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        return response()->json(["data" => $position]);
    }

    /**
     * Update the specified position in storage.
     */
    public function update(StorePositionRequest $request, string $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        // Prevent a position from being its own parent
        if ($request->parent_id == $id) {
            return response()->json(['message' => 'A position cannot be its own parent'], 422);
        }

        $data = $request->validated();
        $position->update($data);

        return response()->json([
            "data" => $position,
            'message' => 'Position updated successfully',
        ], 200);
    }

    /**
     * Remove the specified position from storage.
     */
    public function destroy(string $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        // Check if there are employees assigned to this position before deleting
        // This is optional depending on your business logic
        if ($position->employees()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete position. There are employees assigned to it.'
            ], 422);
        }

        $position->delete();

        return response()->json(['message' => 'Position deleted successfully'], 200);
    }
}
