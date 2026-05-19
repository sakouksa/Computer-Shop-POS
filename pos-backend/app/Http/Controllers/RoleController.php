<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class RoleController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the controller actions.
     */
    public static function middleware(): array
    {
        return [
            // Using your specific permission list
            new Middleware('permission:role.view', only: ['index']),
            new Middleware('permission:role.view_single', only: ['show']),
            new Middleware('permission:role.create', only: ['store']),
            new Middleware('permission:role.edit', only: ['update']),
            new Middleware('permission:role.delete', only: ['destroy']),
        ];
    }

    // Display a listing of the resource.
    public function index(Request $req)
    {
        $role = Role::query(); //ORM eloquent
        if ($req->has("text_search")) {
            // $role->where("name", "=", $req->input("text_search")); // ទាល់តែដូចគ្នាបាន search filter ចេញ
            $role->where("name", "LIKE", "%" . $req->input("text_search") . "%"); //Function នេះ ស្រដៀងក៌វា search filter ចេញដែលគេប្រើ "LIKE"
        };
        if ($req->has("status")) {
            $role->where("status", "=", $req->input("status"));
        }
        $list = $role->orderBy('id', 'desc')->get();
        return response()->json([
            'list' => $list,
        ]);
    }

    // Store a newly created resource in storage.
    public function store(RoleRequest $request)
    {
        $role = Role::create($request->validated());
        return response()->json([
            'data' => $role,
            'message' => 'បានបង្កើតតួនាទីថ្មីដោយជោគជ័យ',
        ], 200);
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
        if (!$role) {
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
        if (!$role) {
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
