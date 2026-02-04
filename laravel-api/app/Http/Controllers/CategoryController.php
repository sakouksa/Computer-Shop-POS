<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Display a listing of the resource.
    public function index()
    {
        return Category::all();
    }

    // Store a newly created resource in storage.
    public function store(Request $request)
    {
        $category = new Category;
        $category->name = $request->input('name');
        $category->description = $request->input('description');
        $category->status = $request->input('status');
        $category->parent_id = $request->input('parent_id');
        $category->save();

        return [
            'data' => $category,
            'message' => 'save successfully',
        ];
    }

    // Display the specified resource.
    public function show(string $id)
    {
        return Category::find($id);
    }

    // Update the specified resource in storage.
    public function update(Request $request, string $id)
    {
        $category = Category::find($id);
        if (! $category) {
            return [
                'error' => true,
                'message' => 'Not found',
            ];
        }

        $category->name = $request->input('name');
        $category->description = $request->input('description');
        $category->status = $request->input('status');
        $category->parent_id = $request->input('parent_id');
        $category->save();

        return [
            'data' => $category,
            'message' => 'Update success',
        ];
    }

    // Remove the specified resource from storage.
    public function destroy(string $id)
    {
        $category = Category::find($id);
        if (! $category) {
            return [
                'error' => true,
                'message' => 'data delete not found',
            ];
        } else {
            $category->delete();

            return [
                'data' => $category,
                'success' => 'delete category success',
            ];
        }
    }

    // Change Status
    public function changeStatus(Request $request, $id)
    {
        $category = Category::find($id);
        if (! $category) {
            return response()->json(['message' => 'Error'], 404);
        }

        $category->status = $request->input('status');
        $category->save();

        return [
            'message' => 'Status updated successfully',
            'data' => $category,
        ];
    }
}
