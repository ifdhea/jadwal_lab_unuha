#!/usr/bin/env python3
# Script untuk fix rowspan calculation di Calendar.tsx

with open('resources/js/pages/TukarJadwal/Calendar.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Ada 2 tempat yang perlu difix (line 652-666 dan line 951-965)
# Pattern: lines yang contain "maxRowSpan = Math.max(...cellsData.map((cell) => cell.durasi_slot"

replacements_made = 0

i = 0
while i < len(lines):
    line = lines[i]
    
    # Cek apakah ini line yang perlu diganti
    if 'maxRowSpan = Math.max(...cellsData.map((cell) => cell.durasi_slot' in line:
        print(f'Found pattern at line {i+1}')
        
        # Ambil indentation dari line ini
        indent = len(line) - len(line.lstrip())
        base_indent = ' ' * indent
        
        # Replace dengan logika baru
        new_lines = [
            f'{base_indent}// Untuk setiap jadwal di cell ini, hitung rowspan yang sebenarnya\n',
            f'{base_indent}const rowSpans = cellsData.map((cell) => {{\n',
            f'{base_indent}    if (cell.slot_mulai_id && cell.slot_selesai_id) {{\n',
            f'{base_indent}        // Hitung berapa banyak slot visible dari mulai ke selesai\n',
            f'{base_indent}        const mulaiIdx = slots.findIndex(s => s.id === cell.slot_mulai_id);\n',
            f'{base_indent}        const selesaiIdx = slots.findIndex(s => s.id === cell.slot_selesai_id);\n',
            f'{base_indent}        \n',
            f'{base_indent}        if (mulaiIdx !== -1 && selesaiIdx !== -1) {{\n',
            f'{base_indent}            return selesaiIdx - mulaiIdx + 1; // +1 karena inclusive\n',
            f'{base_indent}        }}\n',
            f'{base_indent}    }}\n',
            f'{base_indent}    // Fallback ke durasi_slot jika tidak ada info slot_id\n',
            f'{base_indent}    return cell.durasi_slot || 1;\n',
            f'{base_indent}}});\n',
            f'{base_indent}\n',
            f'{base_indent}maxRowSpan = Math.max(...rowSpans);\n',
        ]
        
        # Replace line ini dengan new_lines
        lines[i:i+1] = new_lines
        i += len(new_lines)
        replacements_made += 1
    else:
        i += 1

print(f'Replacements made: {replacements_made}')

# Update comment di atas if statement
for i in range(len(lines)):
    if 'Hitung rowspan dinamis berdasarkan durasi_slot' in lines[i]:
        indent = len(lines[i]) - len(lines[i].lstrip())
        lines[i] = ' ' * indent + '// Hitung rowspan berdasarkan slot VISIBLE (slots yang tidak di-hide)\n'
        print(f'Updated comment at line {i+1}')
    if 'Langsung pakai durasi_slot dari backend (sudah include override)' in lines[i]:
        indent = len(lines[i]) - len(lines[i].lstrip())
        lines[i] = ' ' * indent + '// Bukan langsung pakai durasi_slot karena bisa ada gap (slot istirahat)\n'
        print(f'Updated comment at line {i+1}')

# Write back
with open('resources/js/pages/TukarJadwal/Calendar.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Done! File updated.')
