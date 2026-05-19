<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeePayrollRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'payroll_id' => 'required|exists:payrolls,id',
            'employee_id' => 'required|exists:employees,id',
            'base_salary' => 'required|numeric|min:0',
            'ot_amount' => 'nullable|numeric|min:0',
            'allowance' => 'nullable|numeric|min:0',
            'deduction_amount' => 'nullable|numeric|min:0',
        ];
    }

    public function attributes(): array
    {
        return [
            'payroll_id' => 'Payroll Batch',
            'employee_id' => 'Employee',
            'base_salary' => 'Base Salary',
            'ot_amount' => 'Overtime Amount',
            'allowance' => 'Allowance',
            'deduction_amount' => 'Deduction Amount',
        ];
    }

    /**
     * Set Error Messages in English
     */
    public function messages(): array
    {
        return [
            'required' => 'The :attribute field is required.',
            'numeric' => 'The :attribute must be a number.',
            'exists' => 'The selected :attribute does not exist.',
            'min' => 'The :attribute cannot be a negative value.',
        ];
    }
}
