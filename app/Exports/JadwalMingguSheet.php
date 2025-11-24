<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Collection;

class JadwalMingguSheet implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
    protected $data;
    protected $mingguNomor;
    protected $tanggalMulai;
    protected $tanggalSelesai;

    public function __construct($data, $mingguNomor, $tanggalMulai, $tanggalSelesai)
    {
        $this->data = $data;
        $this->mingguNomor = $mingguNomor;
        $this->tanggalMulai = $tanggalMulai;
        $this->tanggalSelesai = $tanggalSelesai;
    }

    public function collection()
    {
        return collect($this->data);
    }

    public function headings(): array
    {
        return [
            'Kampus',
            'Laboratorium',
            'Hari',
            'Tanggal',
            'Waktu Mulai',
            'Waktu Selesai',
            'Status',
            'Mata Kuliah',
            'Kelas',
            'Dosen',
            'SKS',
            'Keperluan',
        ];
    }

    public function title(): string
    {
        return "Minggu {$this->mingguNomor}";
    }

    public function styles(Worksheet $sheet)
    {
        // Style untuk header
        $sheet->getStyle('A1:L1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 12,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'rgb' => '4472C4',
                ],
            ],
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Auto-filter untuk header
        $sheet->setAutoFilter('A1:L1');

        // Conditional formatting untuk status
        foreach ($sheet->getRowIterator(2) as $row) {
            $rowIndex = $row->getRowIndex();
            $status = $sheet->getCell('G' . $rowIndex)->getValue();
            
            if ($status === 'Terjadwal' || $status === 'Terjadwal (Ditukar)') {
                // Warna hijau muda untuk slot terjadwal
                $sheet->getStyle('A' . $rowIndex . ':L' . $rowIndex)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'E2EFDA'],
                    ],
                ]);
            } elseif ($status === 'Booking') {
                // Warna biru muda untuk booking
                $sheet->getStyle('A' . $rowIndex . ':L' . $rowIndex)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'D9E1F2'],
                    ],
                ]);
            } elseif ($status === 'Tidak Masuk') {
                // Warna kuning muda untuk tidak masuk
                $sheet->getStyle('A' . $rowIndex . ':L' . $rowIndex)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'FFF2CC'],
                    ],
                ]);
            } elseif ($status === 'Kosong') {
                // Warna abu-abu muda untuk slot kosong
                $sheet->getStyle('A' . $rowIndex . ':L' . $rowIndex)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F2F2F2'],
                    ],
                ]);
            }
        }

        return [];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 12,  // Kampus
            'B' => 20,  // Laboratorium
            'C' => 10,  // Hari
            'D' => 12,  // Tanggal
            'E' => 12,  // Waktu Mulai
            'F' => 12,  // Waktu Selesai
            'G' => 20,  // Status
            'H' => 30,  // Mata Kuliah
            'I' => 25,  // Kelas
            'J' => 25,  // Dosen
            'K' => 8,   // SKS
            'L' => 20,  // Keperluan
        ];
    }
}
