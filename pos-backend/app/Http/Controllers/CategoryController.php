<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Nette\Utils\Json;

class CategoryController extends Controller implements hasMiddleware
{
    /**
     * Define middleware for category actions based on your permission list.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:category.view', only: ['index']),
            new Middleware('permission:category.viewone', only: ['show']),
            new Middleware('permission:category.create', only: ['store']),
            new Middleware('permission:category.update', only: ['update']),
            new Middleware('permission:category.delete', only: ['destroy']),
        ];
    }

    // Display a listing of the resource.
    public function index(Request $req)
    {
        $cat = Category::query(); //ORM
        if ($req->has("txt_search")) {
            $cat->where("name", "LIKE", "%" . $req->input("txt_search") . "%");
        };
        if ($req->has("status")) {
            $cat->where("status", "=", $req->input("status"));
        }
        $list = $cat->orderBy('id', 'desc')->get();
        return response()->json([
            'list' => $list,
        ]);
    }

    // Store a newly created resource in storage.
    public function store(Request $request)
    {
        $validations = $request->validate([
            'name' => 'required|string',
            'status' => 'required|boolean',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|integer'
        ]);
        $cat = Category::create($validations);

        return [
            'data' => $cat,
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
        $cat = Category::find($id);

        if (!$cat) {
            return response()->json([
                'error' => true,
                'message' => 'រកមិនឃើញទិន្នន័យសម្រាប់កែប្រែទេ!',
            ], 404);
        }

        $validations = $request->validate([
            'name' => 'required|string',
            'status' => 'required|boolean',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|integer'
        ]);

        $cat->update($validations);

        return response()->json([
            'data' => $cat,
            'message' => 'ធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ!',
        ]);
    }

    // Remove the specified resource from storage.
    public function destroy(string $id)
    {
        $category = Category::find($id);
        if (!$category) {
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
        if (!$category) {
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
