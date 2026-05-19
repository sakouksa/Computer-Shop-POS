<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethod extends Model
{
    protected $table = 'payment_methods';
    protected $fillable = [
        'name',
        'code',
        'logo',
        'description',
        'is_active'
    ];

    /**
     * កំណត់ប្រភេទជួរទិន្នន័យ (Casting) សម្រាប់ភាពសុក្រឹត
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * (One-to-Many Relationship)
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'payment_method_id');
    }
}
