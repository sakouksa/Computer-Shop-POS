<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Brand extends Model
{
    protected $fillable = [
        'name',
        'code',
        'from_country',
        'image',
        'status'
    ];
    // One Brand has many Products
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}