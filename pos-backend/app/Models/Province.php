<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'distand_from_city',
        'status',
    ];

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
