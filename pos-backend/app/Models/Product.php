<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Brand;
use App\Models\Category;
class Product extends Model
{
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
    // One Product belong to one Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    // One Product belong to one Brand
    public function brand(){
        return $this->belongsTo(Brand::class);
    }
}