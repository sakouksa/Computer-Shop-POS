<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    protected $fillable = [
        'customer_type_id', 'first_name', 'last_name',
        'gender', 'dob', 'tel', 'address', 'created_by'
    ];

    public function customerType(): BelongsTo
    {
        return $this->belongsTo(CustomerType::class, 'customer_type_id');
    }
}
