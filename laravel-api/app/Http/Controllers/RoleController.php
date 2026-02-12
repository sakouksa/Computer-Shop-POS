<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
class RoleController extends Controller
{
    // Display a listing of the resource.
    public function index(Request $req)
    {
        $list = Role::orderBy('id', 'desc')->get();
        return response()->json([
            'list' => $list,
            "query" => $req->input("text_search"),
        ]);
    }

    // Store a newly created resource in storage.
    public function store(RoleRequest $request)
    {
        $role = Role::create($request->validated());
        return response()->json([
            'data' => $role,
            'message' => 'បានបង្កើតតួនាទីថ្មីដោយជោគជ័យ',
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
            'message' => 'បានកែប្រែទិន្នន័យដោយជោគជ័យ',
        ]);
    }

    // Remove the specified resource from storage.
    public function destroy(string $id)
    {
        $role = Role::find($id);
        if (! $role) {
            return [
                'error' => false,
                'message' => 'រកមិនឃើញទិន្នន័យឡើយ',
            ];
        } else {
            $role->delete();

            return [
                'data' => $role,
                'message' => 'បានលុបទិន្នន័យដោយជោគជ័យ',
            ];
        }
    }

    public function changeStatus(Request $request, $id)
    {
        $role = Role::find($id);
        if (! $role) {
            return [
                'error' => true,
                'message' => 'រកមិនឃើញតួនាទីឡើយ',
            ];
        } else {
            $role->status = $request->input('status');
            $role->update();

            return [
                'data' => $role,
                'message' => 'ស្ថានភាពត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ',
            ];
        }
    }
}