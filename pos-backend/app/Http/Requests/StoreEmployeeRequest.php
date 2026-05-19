<?php
// ប្រើ command: php artisan make:request StoreEmployeeRequest

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('employee'); // Get ID for unique validation during update
        return [
            'card_id' => 'required|string|unique:employees,card_id,' . $id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female,Other',
            'dob' => 'required|date',
            'email' => 'required|email|unique:employees,email,' . $id,
            'tel' => 'nullable|string',
            'position_id' => 'required|exists:positions,id',
            'salary' => 'required|numeric|min:0',
            'employment_status' => 'required|in:Full-time,Part-time,Probation,Resigned',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'bank_account_number' => 'nullable|string',
            'bank_account_name' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'image.max' => 'រូបភាពធំពេក! សូមជ្រើសរើសរូបក្រោម 2MB។',
            'image.image' => 'សូមជ្រើសរើសតែ file រូបភាពប៉ុណ្ណោះ។',
            'image.mimes' => 'រូបភាពត្រូវជា jpeg, png, jpg ប៉ុណ្ណោះ។',
        ];
    }
}
