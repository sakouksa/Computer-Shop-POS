<?php

namespace App\Http\Controllers;


use App\Http\Requests\AboutRequest;
use App\Models\About;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    // Display a listing of the resource.
    public function index()
    {
        return response()->json([
            'list' => About::all(),
        ]);
    }

    // Store a newly created resource in storage.
    public function store(AboutRequest $request)
    {
        $data = About::create($request->validated());
        if (! $data){
            return response ()->json ([
                'error' => [
                    'message' => 'Insert About Failed',
                ],
            ], 500);
        }
        return response()->json([
            'data' => $data,
            'message' => 'Insert About Successfully',
        ]);
    }

    // Display the specified resource.
    public function show(string $id)
    {
        return response()->json([
            'data' => About::find($id),
        ]);
    }

    // Update the specified resource in storage.
    public function update(AboutRequest $request, string $id)
    {
        $data = About::findOrFail($id);
        $data->update($request->validated());

        return response()->json([
            'data' => $data,
            'message' => 'Update About Successfully',
        ]);
    }

    // Remove the specified resource from storage.
    public function destroy(string $id)
    {
        $data = About::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'Delete About Successfully',
        ]);
    }
}