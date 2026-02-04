<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Display a listing of the resource.
    public function index()
    {
        return response()->json([
            'total' => Role::count(),
            'list' => Role::all(),
        ]);
    }

    // Store a newly created resource in storage.
    // $request->input("key_name")
    public function store(Request $request)
    {
        $role = new Role; // create new object
        $role->name = $request->input('name');
        $role->code = $request->input('code');
        $role->description = $request->input('description');
        $role->status = $request->input('status');
        $role->test = $request->input('test');
        $role->save();

        return [
            'data' => $role,
            'message' => 'Role inserted successfully',
        ];
    }

    // Display the specified resource.
    public function show(string $id)
    {
        return Role::find($id);
    }

    // Update the specified resource in storage.
    public function update(Request $request, string $id)
    {
        $role = Role::find($id);
        if (! $role) {
            return [
                'error' => true,
                'message' => 'Role not found',
            ];
        } else {
            $role->name = $request->input('name');
            $role->code = $request->input('code');
            $role->description = $request->input('description');
            $role->status = $request->input('status');
            $role->test = $request->input('test');
            $role->update();

            return [
                'data' => $role,
                'message' => 'Role updated successfully',
            ];
        }

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
