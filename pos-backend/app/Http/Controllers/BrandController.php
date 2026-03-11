<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::orderBy('id', 'desc')->get();
        return response()->json([
            "list" => $brands
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:brands,code',
            'from_country' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 1025 = 1M
        ]);
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('brands', 'public');
        }
        // Create the brand
        $brand = Brand::create([
            'name' => $request->name,
            'code' => $request->code,
            'from_country' => $request->from_country,
            'image' => $imagePath,
            'status' => $request->status,
        ]);
        return response()->json([
            "data" => $brand,
            'message' => 'រក្សាទុកម៉ាកយីហោដោយជោគជ័យ',
        ], 200);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $brand = Brand::find($id);
        return response()->json([
            "data" => $brand
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $brand = Brand::find($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:brands,code,' . $id,
            'from_country' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        // កំណត់តម្លៃរូបភាពចាស់ជាមុន ការពារ Error បើ User មិនបានដូររូបថ្មី
        $imagePath = $brand->image;
        if ($request->hasFile('image')) {
            if ($brand->image) {
                Storage::disk('public')->delete($brand->image);
            }
            $imagePath = $request->file('image')->store('brands', 'public');
        }
        $brand->update([
            'name' => $request->name,
            'code' => $request->code,
            'from_country' => $request->from_country,
            'image' => $imagePath,
            'status' => $request->status,
        ]);
        return response()->json([
            "data" => $brand,
            "request" => $request,
            'message' => 'បានកែប្រែទិន្នន័យដោយជោគជ័យ',
        ], 200);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brand::find($id);
        // Delete the if it exists
        if ($brand->image) {
            Storage::disk('public')->delete($brand->image);
        }
        $brand->delete();
        return response()->json([
            'message' => 'បានលុបទិន្នន័យដោយជោគជ័យ'
        ], 200);
    }
}