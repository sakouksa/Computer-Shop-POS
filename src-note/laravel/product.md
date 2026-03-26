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

