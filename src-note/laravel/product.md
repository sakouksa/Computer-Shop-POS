Product(id,category_id,brand_id,product_name,description,quantity,price,image,status)
> php artisan make:model Product -m
> php artisan make:controller ProductController --api

+ In migration

public function up()
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('category_id');
        $table->unsignedBigInteger('brand_id');
        $table->string('product_name');
        $table->text('description')->nullable();
        $table->integer('quantity');
        $table->decimal('price', 10, 2);
        $table->string('image')->nullable();
        $table->boolean('status')->default(1);
        $table->timestamps();

        $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        $table->foreign('brand_id')->references('id')->on('brands')->onDelete('cascade');
    });
}
+ in Model

protected $fillable = [
    'category_id',
    'brand_id',
    'product_name',
    'description',
    'quantity',
    'price',
    'image',
    'status'
];

+ In controller

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // List all products
    public function index()
    {
        return Product::with(['category', 'brand'])->get();
    }

    // Store a new product
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'product_name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'boolean'
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);
        return response()->json($product, 201);
    }
    // Show a single product
    public function show(string $id)
    {
        $product = Product::find($id);
        return response()->json([
            "data" => $product->load(['category', 'brand']),
        ]);
    }

// Update an existing product
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'product_name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
            'status' => 'boolean'
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
           if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);
        return response()->json($product, 200);
    }

// Delete a product
     public function destroy(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                "message" => "រកមិនឃើញផលិតផលនេះទេ"
            ], 404);
        }
        // remove if image exist
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return response()->json([
            "data" =>$product,
            "message" => "ផលិតផលត្រូវបានលុបចេញពីប្រព័ន្ធដោយជោគជ័យ"
        ]);
    }
}

+ Relationship Category Product
    + in Category
    // One category has many Product
    public function products(){
        return $this->hasMany(Product::class);
    }
    + in Brand
    // One Brand has many Products
    public function products(){
        return $this->hasMany(Product::class);
    }
    + in Product
        // One Product belong to one Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    // One Product belong to one Brand
    public function brand(){
        return $this->belongsTo(Brand::class);
    }
+ get list
// Retrieve Products for a Specific Category
    $category = Category::find(1); // Example category
    $products = $category->products; // Returns a collection of Product models

// Retrieve the Category for a Specific Product
    $product = Product::find(1); // Example product
    $category = $product->category; // Returns the Category model

// Get all products with their associated category
$products = Product::with('category')->get();

// Get all categories with their associated products
$categories = Category::with('products')->get();

// Multiple Eager Loading
Product::with(['category', 'brand'])->get();