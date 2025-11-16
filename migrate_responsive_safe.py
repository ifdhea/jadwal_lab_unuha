#!/usr/bin/env python3
"""
Mobile Responsive Calendar Migration Script - SAFE VERSION
===========================================================
Script ini akan mengubah struktur tabel kalender dengan cara yang aman:
1. Backup semua file
2. Extract exact pattern dari Public/Jadwal.tsx (referensi yang benar)
3. Apply pattern yang sama ke file lain dengan careful replacement

Author: AI Assistant
Date: 2025-01-16
"""

import os
import re
import shutil
from datetime import datetime
from pathlib import Path

# Konfigurasi
BASE_DIR = Path(r"D:\laragon\www\proyek_ignitepad\jadwal_lab")
RESOURCES_DIR = BASE_DIR / "resources" / "js" / "pages"

# File referensi (sudah benar)
REFERENCE_FILE = RESOURCES_DIR / "Public" / "Jadwal.tsx"

# File yang perlu dimigrate
FILES_TO_MIGRATE = [
    RESOURCES_DIR / "Jadwal" / "Index.tsx",
    RESOURCES_DIR / "BookingLaboratorium" / "Calendar.tsx",
    RESOURCES_DIR / "TukarJadwal" / "Calendar.tsx",
]


class Colors:
    """ANSI color codes untuk output yang lebih menarik"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'


def print_header(text):
    """Print header dengan warna"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'=' * 70}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'=' * 70}{Colors.END}\n")


def print_success(text):
    """Print success message"""
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")


def print_error(text):
    """Print error message"""
    print(f"{Colors.RED}❌ {text}{Colors.END}")


def print_warning(text):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")


def print_info(text):
    """Print info message"""
    print(f"{Colors.CYAN}ℹ️  {text}{Colors.END}")


def backup_file(file_path):
    """
    Backup file dengan timestamp
    Returns: backup file path
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = file_path.parent / f"{file_path.stem}.backup_{timestamp}{file_path.suffix}"
    shutil.copy2(file_path, backup_path)
    return backup_path


def find_cardcontent_with_table(content, start_search=0):
    """
    Cari CardContent yang berisi table
    Returns: (start_index, end_index, content_inside) atau (None, None, None)
    """
    # Cari semua <CardContent> dan cari yang berisi table
    # Gunakan approach yang lebih sederhana
    pattern = r'<CardContent>(.*?)</CardContent>'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    for match in matches:
        content_inside = match.group(1)
        # Cek apakah ada <table di dalamnya
        if '<table' in content_inside:
            return match.start(), match.end(), content_inside
    
    return None, None, None


def extract_reference_pattern(reference_file):
    """
    Extract pattern mobile + desktop dari reference file (Public/Jadwal.tsx)
    Returns: dict dengan 'mobile_wrapper_start', 'mobile_wrapper_end', etc.
    """
    print_info(f"Reading reference file: {reference_file.name}")
    
    with open(reference_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Cari semua CardContent
    pattern = r'<CardContent>(.*?)</CardContent>'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    # Cari yang berisi "Mobile View" dan "Desktop View"
    cardcontent = None
    for match in matches:
        content_inside = match.group(1)
        if 'Mobile View' in content_inside and 'Desktop View' in content_inside:
            cardcontent = content_inside
            start_idx = match.start()
            end_idx = match.end()
            break
    
    if not cardcontent:
        print_error("Cannot find CardContent with Mobile and Desktop views in reference file")
        return None
    
    print_success(f"Found CardContent block at position {start_idx}-{end_idx}")
    
    # Extract mobile view pattern
    mobile_start = cardcontent.find('{/* Mobile')
    
    if mobile_start == -1:
        print_error("Cannot find mobile view marker")
        return None
    
    # Extract desktop view pattern
    desktop_start = cardcontent.find('{/* Desktop')
    
    if desktop_start == -1:
        print_error("Cannot find desktop view marker")
        return None
    
    mobile_section = cardcontent[mobile_start:desktop_start].strip()
    desktop_section = cardcontent[desktop_start:].strip()
    
    print_success("Successfully extracted mobile and desktop patterns")
    print_info(f"  Mobile section: {len(mobile_section)} chars")
    print_info(f"  Desktop section: {len(desktop_section)} chars")
    
    return {
        'mobile': mobile_section,
        'desktop': desktop_section,
        'full_cardcontent': cardcontent
    }


def get_table_structure_classes(content):
    """
    Extract struktur class yang digunakan untuk mobile dan desktop
    """
    patterns = {
        'mobile_container': r'<div className="block md:hidden">(.*?)</div>\s*{/\* Desktop',
        'mobile_table': r'<table className="([^"]*)"',
        'mobile_time_header': r'<th className="([^"]*)">\s*Jam',
        'mobile_time_cell': r'<td className="([^"]*)"[^>]*>\s*\{slot\.waktu_mulai',
        'mobile_day_column': r'<th[^>]*className="([^"]*border[^"]*min-w)',
        'desktop_container': r'{/\* Desktop[^}]*\*/}\s*<div className="([^"]*)"',
        'desktop_table': r'hidden md:block.*?<table className="([^"]*)"',
    }
    
    results = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, content, re.DOTALL)
        if match:
            results[key] = match.group(1) if match.lastindex else match.group(0)
    
    return results


def migrate_file_content(file_path, reference_pattern):
    """
    Migrate file dengan mengganti CardContent structure
    """
    print_info(f"Processing: {file_path.name}")
    
    # Read file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    
    # Find CardContent with table
    start_idx, end_idx, old_cardcontent = find_cardcontent_with_table(content)
    
    if not start_idx:
        print_error(f"  Cannot find CardContent with table in {file_path.name}")
        return None
    
    print_success(f"  Found CardContent at {start_idx}-{end_idx}")
    
    # Extract the table content (tbody logic) from old content
    # Kita perlu preserve semua logic yang ada di dalam table
    
    # Ambil content sebelum dan sesudah CardContent
    before_cardcontent = content[:start_idx + 14]  # +14 untuk include <CardContent>
    after_cardcontent = content[end_idx - 15:]  # -15 untuk before </CardContent>
    
    # Sekarang kita perlu "transplant" table logic ke dalam mobile dan desktop view
    # Ini adalah bagian yang tricky - kita perlu extract pure table
    
    # Cari table element dalam old cardcontent
    table_match = re.search(r'(<table[^>]*>.*?</table>)', old_cardcontent, re.DOTALL)
    
    if not table_match:
        print_error(f"  Cannot find table element in {file_path.name}")
        return None
    
    original_table = table_match.group(1)
    
    print_success(f"  Extracted table: {len(original_table)} chars")
    
    # Buat mobile view dengan original table (adjusted)
    mobile_table = original_table
    
    # Adjust classes untuk mobile
    # 1. Table class
    mobile_table = re.sub(
        r'<table className="[^"]*"',
        '<table className="border-collapse text-sm"',
        mobile_table,
        count=1
    )
    
    # 2. Time header class  
    mobile_table = re.sub(
        r'(<th className=")[^"]*(">[^<]*Jam)',
        r'\1sticky left-0 z-20 w-24 border-r-2 border-r-gray-300 bg-muted p-1 font-semibold shadow-md\2',
        mobile_table,
        count=1
    )
    
    # 3. Time cell class (body)
    mobile_table = re.sub(
        r'(<td className=")[^"]*?("[^>]*>\s*\{slot\.waktu_mulai)',
        r'\1sticky left-0 z-10 border-r-2 border-r-gray-300 p-1 text-center font-mono text-xs font-semibold shadow-md whitespace-nowrap\2',
        mobile_table
    )
    
    # 4. Background untuk time cells (handle isBreakTime)
    mobile_table = re.sub(
        r'(isBreakTime\s*\?\s*["\'])(bg-muted[^"\']*)',
        r'\1bg-muted h-16',
        mobile_table
    )
    mobile_table = re.sub(
        r'(:\s*["\'])(bg-background[^"\']*)',
        r'\1bg-background h-24',
        mobile_table
    )
    
    # 5. Day columns - tambahkan min-w-[140px]
    # Ini lebih tricky karena ada conditional classes
    mobile_table = re.sub(
        r'(<th[^>]*className=["\'])([^"\']*)(border[^"\']*?)(["\'])',
        r'\1\2\3 min-w-[140px]\4',
        mobile_table
    )
    
    # Buat desktop table (tetap original dengan slight adjustments)
    desktop_table = original_table
    
    # Desktop table class
    desktop_table = re.sub(
        r'<table className="[^"]*"',
        '<table className="w-full table-fixed border-collapse text-sm"',
        desktop_table,
        count=1
    )
    
    # Build new CardContent
    new_cardcontent = f'''
                                        {{/* Mobile View - Fixed time column, scrollable days */}}
                                        <div className="block md:hidden">
                                            <div className="relative">
                                                <div className="overflow-x-auto">
                                                    <div className="min-w-max">
{indent_lines(mobile_table, 40)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {{/* Desktop View */}}
                                        <div className="hidden md:block">
                                            <div className="overflow-x-auto">
{indent_lines(desktop_table, 32)}
                                            </div>
                                        </div>
                                    '''
    
    # Rebuild file
    new_content = before_cardcontent + new_cardcontent + after_cardcontent
    
    new_size = len(new_content)
    print_success(f"  Size: {original_size} → {new_size} bytes (diff: {new_size - original_size:+d})")
    
    return new_content


def indent_lines(text, spaces):
    """Add indentation to each line"""
    indent = ' ' * spaces
    lines = text.split('\n')
    return '\n'.join([indent + line if line.strip() else line for line in lines])


def main():
    """Main execution"""
    print_header("🚀 Mobile Responsive Calendar Migration Script")
    
    print(f"Base Directory: {BASE_DIR}")
    print(f"Files to migrate: {len(FILES_TO_MIGRATE)}\n")
    
    for i, file_path in enumerate(FILES_TO_MIGRATE, 1):
        print(f"  {i}. {file_path.relative_to(BASE_DIR)}")
    
    # Check if all files exist
    print("\n" + Colors.BOLD + "Checking files..." + Colors.END)
    all_exist = True
    for file_path in [REFERENCE_FILE] + FILES_TO_MIGRATE:
        if file_path.exists():
            print_success(f"  {file_path.name}")
        else:
            print_error(f"  {file_path.name} NOT FOUND")
            all_exist = False
    
    if not all_exist:
        print_error("\nSome files are missing. Please check.")
        return
    
    # Warning
    print_warning("\n⚠️  IMPORTANT:")
    print("   - This script will modify TypeScript/TSX files")
    print("   - Automatic backups will be created")
    print("   - Make sure you have no uncommitted changes in Git")
    
    try:
        input(f"\n{Colors.BOLD}Press ENTER to continue or CTRL+C to cancel...{Colors.END}")
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Migration cancelled by user.{Colors.END}")
        return
    
    # Extract reference pattern
    print_header("📖 Extracting Reference Pattern")
    reference_pattern = extract_reference_pattern(REFERENCE_FILE)
    
    if not reference_pattern:
        print_error("Failed to extract reference pattern")
        return
    
    # Migrate each file
    print_header("🔧 Migrating Files")
    
    results = []
    for file_path in FILES_TO_MIGRATE:
        print(f"\n{Colors.BOLD}{'─' * 70}{Colors.END}")
        print(f"{Colors.BOLD}File: {file_path.name}{Colors.END}")
        print(f"{'─' * 70}")
        
        try:
            # Backup
            backup_path = backup_file(file_path)
            print_success(f"Backup created: {backup_path.name}")
            
            # Migrate
            new_content = migrate_file_content(file_path, reference_pattern)
            
            if new_content:
                # Write new content
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print_success(f"Successfully migrated: {file_path.name}")
                results.append({'file': file_path.name, 'success': True})
            else:
                print_error(f"Failed to migrate: {file_path.name}")
                results.append({'file': file_path.name, 'success': False})
                
        except Exception as e:
            print_error(f"Error migrating {file_path.name}: {str(e)}")
            results.append({'file': file_path.name, 'success': False})
            
            # Restore from backup if exists
            if 'backup_path' in locals():
                print_warning(f"Restoring from backup...")
                shutil.copy2(backup_path, file_path)
    
    # Summary
    print_header("📊 Migration Summary")
    
    success_count = sum(1 for r in results if r['success'])
    
    for result in results:
        status = "✅ SUCCESS" if result['success'] else "❌ FAILED"
        print(f"  {status}: {result['file']}")
    
    print(f"\n{Colors.BOLD}Total: {success_count}/{len(results)} successful{Colors.END}")
    
    if success_count == len(results):
        print_success("\n🎉 All files successfully migrated!")
        print(f"\n{Colors.BOLD}Next Steps:{Colors.END}")
        print("   1. Test in browser (mobile & desktop responsive mode)")
        print("   2. Verify fixed time column on horizontal scroll")
        print("   3. Check all functionality still works")
        print("   4. Commit changes if everything is OK")
    else:
        print_warning("\n⚠️  Some files failed to migrate.")
        print("   Check error messages above and try manual migration.")
    
    print(f"\n{Colors.BLUE}{'=' * 70}{Colors.END}\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}❌ Migration cancelled by user.{Colors.END}")
    except Exception as e:
        print(f"\n\n{Colors.RED}❌ Unexpected error: {str(e)}{Colors.END}")
        import traceback
        traceback.print_exc()
