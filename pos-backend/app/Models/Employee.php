<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use  Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    protected $fillable = [
        'card_id', 'image', 'first_name', 'last_name', 'gender', 'dob',
        'email', 'tel', 'position_id', 'salary', 'employment_status',
        'payment_method_id', 'bank_account_number', 'bank_account_name'
    ];

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function payrolls()
    {
        return $this->hasMany(EmployeePayroll::class);
    }
}
