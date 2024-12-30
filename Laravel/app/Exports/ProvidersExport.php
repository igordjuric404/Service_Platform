<?php

namespace App\Exports;

use App\Models\Provider;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class ProvidersExport implements FromCollection, WithHeadings, WithCustomCsvSettings
{
    public function collection()
    {
        return Provider::withCount('appointments')
            ->withAvg('reviews', 'rating')
            ->get(['id', 'name', 'type', 'email']);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Type',
            'Email',
            'Total Appointments',
            'Average Rating',
        ];
    }

    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ';',
        ];
    }
}
