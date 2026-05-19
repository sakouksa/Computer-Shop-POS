<?php

namespace App\Exports;

use App\Models\EmployeePayroll;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EmployeePayrollExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        // select data with relation
        return EmployeePayroll::with(['employee', 'payroll'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Payroll ID',
            'Employee ID',
            'Employee Name',
            'Base Salary',
            'OT Amount',
            'Allowance',
            'Deduction',
            'Net Salary',
            'Created At',
            'Updated At',
        ];
    }

    public function map($item): array
    {
        return [
            $item->id,
            $item->payroll_id,
            $item->employee_id,
            optional($item->employee)->first_name . ' ' . optional($item->employee)->last_name,
            $item->base_salary,
            $item->ot_amount,
            $item->allowance,
            $item->deduction_amount,
            $item->net_salary,
            $item->created_at,
            $item->updated_at,
        ];
    }
}
