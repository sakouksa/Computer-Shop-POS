<?php
// Run: php artisan make:request StorePayrollRequest
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePayrollRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'payment_date' => 'required|date',
            'status' => 'nullable|string',
            'created_by' => 'nullable|integer',
            'approved_by' => 'nullable|integer',
        ];
    }
}
