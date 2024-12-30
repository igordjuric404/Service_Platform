<?php

namespace App\Exports;

use App\Models\Service;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class ServicesExport implements FromCollection, WithHeadings, WithCustomCsvSettings
{
    public function collection()
    {
        return Service::with('provider')
            ->get(['id', 'provider_id', 'title', 'description', 'price']);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Provider ID',
            'Title',
            'Description',
            'Price',
        ];
    }

    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ';', 
        ];
    }
}
