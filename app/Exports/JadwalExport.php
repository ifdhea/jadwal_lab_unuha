<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class JadwalExport implements WithMultipleSheets
{
    protected $sheets;

    public function __construct($sheets)
    {
        $this->sheets = $sheets;
    }

    public function sheets(): array
    {
        return $this->sheets;
    }
}
