<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProvinceRequest;
use App\Models\Province;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProvinceController extends Controller
{
    // Display a listing of the resource.
    public function index(Request $req)
    {
        $province = Province::query(); //ORM eloquent
        if ($req->has("text_search")) {
            // $role->where("name", "=", $req->input("text_search")); // ទាល់តែដូចគ្នាបាន search filter ចេញ
            $province->where("name", "LIKE", "%" . $req->input("text_search") . "%"); //Function នេះ ស្រដៀងក៌វា search filter ចេញដែលគេប្រើ "LIKE"
        };
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

        return response()->json(
            [
                'data' => $data,
                'message' => 'រក្សាទុកបានជោគជ័យ',
            ]
        );
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
        if (! $data) {
            return response()->json([
                'error' => [
                    'update' => 'រកមិនឃើញទិន្នន័យដើម្បីកែប្រែឡើយ!',
                ],
            ]);
        } else {
            $data->fill($validation);
            $data->update();

            return response()->json([
                'message' => 'ធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ',
            ]);
        }
    }

    // Remove the specified resource from storage.
    public function destroy(string $id)
    {
        $data = Province::find($id);
        if (! $data) {
            return response()->json([
                'error' => [
                    'delete' => 'រកមិនឃើញទិន្នន័យដែលត្រូវលុបឡើយ!',
                ],
            ]);
        } else {
            $data->delete();

            return response()->json([
                'message' => 'លុបទិន្នន័យបានជោគជ័យ',
            ]);
        }
    }
}
