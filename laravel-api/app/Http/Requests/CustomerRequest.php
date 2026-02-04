<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // ទាញយក ID ពី URL (ឧទាហរណ៍៖ api/customer/3)
        $id = $this->route('customer');

        return [
            'name' => 'required|string',
            // បន្ថែម ,'.$id នៅខាងចុង unique rule
            'email' => 'required|email|unique:customers,email,'.$id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ];
    }
}
