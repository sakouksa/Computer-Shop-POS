<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Display a listing of the resource.
    public function index()
    {
        $list = Role::orderBy('id', 'desc')->get();
        return response()->json([
            'list' => $list,
        ]);
    }

    // Store a newly created resource in storage.
    // $request->input("key_name")
    public function store(RoleRequest $request)
    {
        $role = Role::create($request->validated());
        return response()->json([
            'data' => $role,
            'message' => 'Role created successfully',
        ]);
    }

    // Display the specified resource.
    public function show(string $id)
    {
        return Role::find($id);
    }

    // Update the specified resource in storage.
    public function update(RoleRequest $request, string $id)
    {
        $role = Role::findOrFail($id);
        $role->update($request->validated());

        return response()->json([
            'data' => $role,
            'message' => 'Role updated successfully',
        ]);
    }

    // Remove the specified resource from storage.
    public function destroy(string $id)
    {
        $role = Role::find($id);
        if (! $role) {
            return [
                'error' => false,
                'message' => 'Data not found',
            ];
        } else {
            $role->delete();

            return [
                'data' => $role,
                'message' => 'Role deleted successfully',
            ];
        }

    }

    public function changeStatus(Request $request, $id)
    {
        $role = Role::find($id);
        if (! $role) {
            return [
                'error' => true,
                'message' => 'Role not found',
            ];
        } else {
            $role->status = $request->input('status');
            $role->update();

            return [
                'data' => $role,
                'message' => 'Role status ('.$role->status.') changed successfully',
            ];
        }
    }
}