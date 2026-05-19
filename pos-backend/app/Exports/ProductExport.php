<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        // ទាញយកទិន្នន័យទាំងអស់ រួមទាំង Category និង Brand
        return Product::with(['category', 'brand'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Category ID',
            'Brand ID',
            'Product Name',
            'Description',
            'Quantity',
            'Price',
            'Image Path',
            'Status',
            'Created At',
            'Updated At'
        ];
    }

    public function map($product): array
    {
        // រៀបចំទិន្នន័យឱ្យត្រូវតាមលំដាប់លំដោយនៃ headings
        return [
            $product->id,
            $product->category_id,
            $product->brand_id,
            $product->product_name,
            $product->description,
            $product->quantity,
            $product->price,
            $product->image,
            $product->status == 1 ? 'Active' : 'Inactive',
            $product->created_at,
            $product->updated_at,
        ];
    }
}
