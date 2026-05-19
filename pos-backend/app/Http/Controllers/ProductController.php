<?php

namespace App\Http\Controllers;

use App\Exports\EmployeeExport;
use App\Http\Requests\ProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Nette\Utils\Json;
use App\Exports\ProductExport;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller implements hasMiddleware
{
    /**
     * Define middleware for the controller actions.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:product.view', only: ['index', 'show']),
            new Middleware('permission:product.create', only: ['store']),
            new Middleware('permission:product.update', only: ['update']),
            new Middleware('permission:product.delete', only: ['destroy']),

            new Middleware('permission:product.import', only: ['import']),
            new Middleware('permission:product.export', only: ['export']),

            new Middleware('permission:product.barcode', only: ['barcode']),
            new Middleware('permission:product.imei', only: ['imei']),
        ];
    }

    public function export()
    {
        return Excel::download(new ProductExport, 'Product_List.xlsx');
    }

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
        // total product count
        $total = $query->count();
        return response()->json([
            "list" => $product,
            "total" => $total,
            "category" => Category::all(),
            "brand" => Brand::all(),
        ]);
    }

    // Store a new product

    public function store(ProductRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            // បង្កើត Folder products ក្នុង storage/app/public
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);
        return response()->json([
            "message" => "Save Product Success",
            "data" => $product,
        ], 201);
    }

    // Show a single product
    public function show(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                "message" => "Data Not Found",
            ], 404);
        }
        return response()->json([
            "data" => $product->load(['category', 'brand']),
        ], 201);
    }

    // Update the specified resource in storage.

    public function update(ProductRequest $request, string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                "message" => "Data Not Found",
            ], 404);
        }
        $data = $request->validated();

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
            "message" => "Update Product Success",
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
                "message" => "Data Not Found",
            ], 404);
        }

        // បើមានរូបភាព គឺលុបរូបភាពចេញពី Folder សិន
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        // delete data in Database
        $product->delete();

        return response()->json([
            "message" => "Delete Product Success",
            "data" => $product
        ], 200);
    }
}
