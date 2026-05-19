<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProvinceRequest;
use App\Models\Province;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ProvinceController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the controller actions.
     */
    public static function middleware(): array
    {
        return [
            // Protect actions with specific permissions
            new Middleware('permission:province.view', only: ['index', 'show']),
            new Middleware('permission:province.create', only: ['store']),
            new Middleware('permission:province.update', only: ['update']),
            new Middleware('permission:province.delete', only: ['destroy']),
        ];
    }

    // Display a listing of the resource.
    public function index(Request $req)
    {
        $province = Province::query();

        if ($req->has("text_search")) {
            $province->where("name", "LIKE", "%" . $req->input("text_search") . "%");
        }

        if ($req->has("status")) {
            $province->where("status", "=", $req->input("status"));
        }

        $list = $province->orderBy('id', 'desc')->get();

        return response()->json([
            'list' => $list,
        ]);
    }

    // Store a newly created resource in storage.
    public function store(ProvinceRequest $request)
    {
        $validation = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'description' => 'nullable|string',
            'distand_from_city' => 'required|numeric',
            'status' => 'required|boolean',
        ]);

        $data = Province::create($validation);

        return response()->json([
            'data' => $data,
            'message' => 'Saved successfully',
        ]);
    }

    // Display the specified resource.
    public function show(string $id)
    {
        return response()->json([
            'data' => Province::find($id),
        ]);
    }

    // Update the specified resource in storage.
    public function update(Request $request, string $id)
    {
        $validation = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'description' => 'nullable|string',
            'distand_from_city' => 'required|numeric',
            'status' => 'required|boolean',
        ]);

        $data = Province::find($id);

        if (!$data) {
            return response()->json([
                'error' => [
                    'update' => 'Data not found for update!',
                ],
            ]);
        } else {
            $data->fill($validation);
            $data->update();

            return response()->json([
                'message' => 'Updated successfully',
            ]);
        }
    }

    // Remove the specified resource from storage.
    public function destroy(string $id)
    {
        $data = Province::find($id);

        if (!$data) {
            return response()->json([
                'error' => [
                    'delete' => 'Data not found for deletion!',
                ],
            ]);
        } else {
            $data->delete();

            return response()->json([
                'message' => 'Deleted successfully',
            ]);
        }
    }
}
