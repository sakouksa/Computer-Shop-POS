<?php


namespace App\Exports;

use App\Models\Employee;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EmployeeExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * ទាញយក Collection នៃទិន្នន័យបុគ្គលិកទាំងអស់ រួមជាមួយ Relation
     */
    public function collection()
    {
        return Employee::with(['position', 'paymentMethod'])->get();
    }

    /**
     * កំណត់ចំណងជើងជួរដេកខាងលើ (Headings) ឱ្យគ្រប់ Field
     */
    public function headings(): array
    {
        return [
            'ID Card',
            'First Name',
            'Last Name',
            'Gender',
            'Date of Birth',
            'Email',
            'Telephone',
            'Position',
            'Salary',
            'Employment Status',
            'Payment Method',
            'Bank Account Name',
            'Bank Account Number',
            'Image Path'
        ];
    }

    /**
     * រៀបចំទិន្នន័យក្នុងជួរដេកនីមួយៗឱ្យត្រូវតាម Headings
     */
    public function map($employee): array
    {
        return [
            $employee->card_id,
            $employee->first_name,
            $employee->last_name,
            $employee->gender,
            $employee->dob,
            $employee->email,
            $employee->tel,
            $employee->position ? $employee->position->name : '',
            $employee->salary,
            $employee->employment_status,
            $employee->paymentMethod ? $employee->paymentMethod->name : '',
            $employee->bank_account_name,
            $employee->bank_account_number,
            $employee->image,
        ];
    }
}
