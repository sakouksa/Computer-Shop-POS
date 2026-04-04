<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Nette\Utils\Json;

class ProductController extends Controller
{
    // Get list of products with filters and pagination
    public function index(Request $request)
    {
        $query = Product::query(); //ORM Eloquent
        if ($request->has('id')) {
            $query->where("id", "=", $request->input("id"));
        }
        if ($request->has('category_id')) {
            $query->where("category_id", "=", $request->input("category_id"));
        }
        if ($request->has('brand_id')) {
            $query->where("brand_id", "=", $request->input("brand_id"));
        }
        if ($request->has('txt_search')) {
            $query->where("product_name", "LIKE", "%" . $request->input("txt_search") . "%");
        }
        if ($request->has('status')) {
            $query->where("status", "=", $request->input("status"));
        }
        // $product = $query->get(), // get list product
        $product = $query->with(['category', 'brand'])->orderBy('id', 'desc')->get(); // Get products with related category and brand data
        // $product = $query->with(['category', 'brand'])->paginate(); // Fetch paginated product list including category and brand data

        return response()->json([
            "list" => $product,
            "category" => Category::all(),
            "brand" => Brand::all(),
        ]);
    }

    // Store a new product

    public function store(Request $request)
    {
        // Form data file image
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'product_name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'boolean'
        ]);
        $data = $request->all();

        if ($request->hasFile('image')) {
            // បង្កើត Folder products ក្នុង storage/app/public
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);
        return response()->json([
            "message" => "រក្សាទុកទិន្នន័យផលិតផលថ្មីជោគជ័យ",
            "data" =>  $product,
        ]);
    }

    // Show a single product
    public function show(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                "message" => "រកមិនឃើញផលិតផលនេះទេ"
            ], 404);
        }
        return response()->json([
            "data" => $product->load(['category', 'brand']),
        ]);
    }

    // Update the specified resource in storage.

    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'product_name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'boolean'
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }
        if ($request->image_remove != "") {
            //លុប File ចេញពី Storage
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $imagePath = null;
        }

        $product->update($data);
        return response()->json([
            "data" => $product,
            "message" => "បច្ចុប្បន្នភាពទិន្នន័យផលិតផលជោគជ័យ"
        ], 200);
    }

    // Delete a product

    public function destroy(string $id)
    {
        // រកមើលផលិតផល
        $product = Product::find($id);

        // បើអត់មាន ឱ្យចេញសារ Error
        if (!$product) {
            return response()->json([
                "message" => "រកមិនឃើញផលិតផលនេះទេ"
            ], 404);
        }

        // បើមានរូបភាព គឺលុបរូបភាពចេញពី Folder សិន
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        // delete data in Database
        $product->delete();

        return response()->json([
            "message" => "លុបទិន្នន័យផលិតផលចេញពីប្រព័ន្ធជោគជ័យ",
            "data" => $product
        ], 200);
    }
}