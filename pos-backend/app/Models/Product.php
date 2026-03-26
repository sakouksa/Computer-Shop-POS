<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
