Brand
name
code
from_country
image
status

> php artisan make:model Brand -m
> php artisan make:controller BrandController --api

- File Storage Configuration
  1. Ensure your application is set up to handle file uploads:
     in the .env file, set the FILESYSTEM_DISK to public:
     FILESYSTEM_DISK=public
  2. Run the command to create a symbolic link for public storage:
     > php artisan storage:link
     > This command will make the storage/app/public directory accessible from the public/storage URL.

// database/migrations/xxxx_xx_xx_create_brands_table.php
// database/migrations/xxxx_xx_xx_create_brands_table.php
public function up()
{
Schema::create('brands', function (Blueprint $table) {
$table->id();
$table->string('name');
$table->string('code')->unique();
$table->string('from_country');
$table->string('image')->nullable(); // For storing the image path
$table->enum('status', ['active', 'inactive'])->default('active');
$table->timestamps();
});
} > php artisan migrate > add route
// app/Models/Brand.php
class Brand extends Model
{
use HasFactory;

    protected $fillable = ['name', 'code', 'from_country', 'image', 'status'];

}
//app/Controller/Brand.php

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

* Testing in postman
  + Create a Brand
    URL: POST /api/brands
    Body (form-data):
        name: Brand Name
        code: BR123
        from_country: Country Name
        status: active
        image: (Upload an image file)

  + Update a Brand
    Body (form-data):
        name: Updated Brand Name
        code: BR1234
        from_country: Updated Country Name
        status: inactive
        image: (Upload a new image file if needed)


INSERT INTO brands (name, code, from_country, image, status) VALUES
('Apple', 'APL001', 'USA', 'brands/apple.jpg', 'active'),
('Samsung', 'SAM002', 'South Korea', 'brands/samsung.jpg', 'active'),
('Dell', 'DEL003', 'USA', 'brands/dell.jpg', 'inactive'),
('HP', 'HP004', 'USA', 'brands/hp.jpg', 'active'),
('Lenovo', 'LEN005', 'China', 'brands/lenovo.jpg', 'active'),
('Asus', 'ASU006', 'Taiwan', 'brands/asus.jpg', 'inactive'),
('Acer', 'ACR007', 'Taiwan', 'brands/acer.jpg', 'active'),
('Huawei', 'HUA008', 'China', 'brands/huawei.jpg', 'active'),
('Sony', 'SON009', 'Japan', 'brands/sony.jpg', 'inactive'),
('Microsoft', 'MSF010', 'USA', 'brands/microsoft.jpg', 'active');
