#!/usr/bin/env python3
"""
Mobile Responsive Calendar Migration Script
============================================
Script ini akan mengubah implementasi tabel kalender dari single table
menjadi separate mobile & desktop views seperti di Public/Jadwal.tsx

File yang akan diupdate:
1. resources/js/pages/Jadwal/Index.tsx
2. resources/js/pages/BookingLaboratorium/Calendar.tsx
3. resources/js/pages/TukarJadwal/Calendar.tsx

PENTING: Script ini sudah membuat backup file sebelum mengubah.
"""

import os
import re
import shutil
from datetime import datetime

# Konfigurasi
BASE_DIR = r"D:\laragon\www\proyek_ignitepad\jadwal_lab"
FILES_TO_MIGRATE = [
    {
        "path": r"resources\js\pages\Jadwal\Index.tsx",
        "name": "Jadwal Index (Dosen)",
        "has_buttons": True,  # Ada button "Tidak Masuk" dan "Reset Status"
    },
    {
        "path": r"resources\js\pages\BookingLaboratorium\Calendar.tsx",
        "name": "Booking Lab Calendar",
        "has_buttons": True,  # Ada button "Tidak Masuk" dan "Reset Status"
        "has_click": True,  # Ada onClick untuk booking
    },
    {
        "path": r"resources\js\pages\TukarJadwal\Calendar.tsx",
        "name": "Tukar Jadwal Calendar",
        "has_buttons": False,
        "has_click": True,  # Ada onClick untuk select jadwal
    },
]


def backup_file(file_path):
    """Backup file dengan timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{file_path}.backup_{timestamp}"
    shutil.copy2(file_path, backup_path)
    print(f"  ✅ Backup dibuat: {os.path.basename(backup_path)}")
    return backup_path


def read_file(file_path):
    """Baca file dengan encoding utf-8"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()


def write_file(file_path, content):
    """Tulis file dengan encoding utf-8"""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)


def extract_table_content(content):
    """
    Extract konten table dari CardContent sampai </CardContent>
    Returns: (before_content, table_content, after_content)
    """
    # Pattern untuk menemukan CardContent block yang berisi table
    # Kita cari dari <CardContent> sampai </CardContent> yang pertama setelah table
    
    # Cari start CardContent yang berisi table
    pattern = r'(<CardContent>\s*)(.*?)(\s*</CardContent>)'
    
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        return None, None, None
    
    start_pos = match.start()
    end_pos = match.end()
    
    before = content[:start_pos]
    card_content = match.group(2)  # Isi CardContent
    after = content[end_pos:]
    
    return before, card_content, after


def create_mobile_view(table_content, file_config):
    """
    Buat mobile view dengan fixed time column
    """
    # Template mobile view
    mobile_template = '''                                        {/* Mobile View - Fixed time column, scrollable days */}
                                        <div className="block md:hidden">
                                            <div className="relative">
                                                <div className="overflow-x-auto">
                                                    <div className="min-w-max">
{table_content}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>'''
    
    # Adjust table untuk mobile
    mobile_table = table_content
    
    # Replace table class
    mobile_table = re.sub(
        r'<table className="[^"]*"',
        '<table className="border-collapse text-sm"',
        mobile_table
    )
    
    # Replace time column header class
    mobile_table = re.sub(
        r'<th className="sticky left-0[^"]*">\s*Jam',
        '<th className="sticky left-0 z-20 w-24 border-r-2 border-r-gray-300 bg-muted p-1 font-semibold shadow-md">\n                                                                                Jam',
        mobile_table
    )
    
    # Replace time column body class
    mobile_table = re.sub(
        r'<td className="sticky left-0[^"]*?"([^>]*)>\s*\{slot\.waktu_mulai',
        r'<td className="sticky left-0 z-10 border-r-2 border-r-gray-300 p-1 text-center font-mono text-xs font-semibold shadow-md whitespace-nowrap"\1>\n                                                                                    {slot.waktu_mulai',
        mobile_table
    )
    
    # Replace day column class - tambahkan min-w-[140px]
    mobile_table = re.sub(
        r'<th([^>]*?)className="([^"]*?border[^"]*?)"',
        r'<th\1className="\2 min-w-[140px]"',
        mobile_table
    )
    
    # Indentasi yang benar
    mobile_table_lines = mobile_table.split('\n')
    indented_table = '\n'.join(['                                                        ' + line if line.strip() else line 
                                  for line in mobile_table_lines])
    
    return mobile_template.replace('{table_content}', indented_table)


def create_desktop_view(table_content):
    """
    Buat desktop view - tetap seperti original tapi dengan wrapper yang benar
    """
    desktop_template = '''
                                        {/* Desktop View */}
                                        <div className="hidden md:block">
                                            <div className="overflow-x-auto">
{table_content}
                                            </div>
                                        </div>'''
    
    # Adjust table untuk desktop
    desktop_table = table_content
    
    # Replace table class
    desktop_table = re.sub(
        r'<table className="[^"]*"',
        '<table className="w-full table-fixed border-collapse text-sm"',
        desktop_table
    )
    
    # Indentasi yang benar
    desktop_table_lines = desktop_table.split('\n')
    indented_table = '\n'.join(['                                                ' + line if line.strip() else line 
                                  for line in desktop_table_lines])
    
    return desktop_template.replace('{table_content}', indented_table)


def migrate_file(file_config):
    """
    Migrate satu file
    """
    file_path = os.path.join(BASE_DIR, file_config["path"])
    
    print(f"\n📝 Memproses: {file_config['name']}")
    print(f"   File: {file_config['path']}")
    
    if not os.path.exists(file_path):
        print(f"  ❌ File tidak ditemukan: {file_path}")
        return False
    
    # Backup
    backup_path = backup_file(file_path)
    
    try:
        # Baca file
        content = read_file(file_path)
        original_content = content
        
        # Extract table content
        print("  🔍 Mencari CardContent block...")
        
        # Cari semua CardContent yang berisi table
        # Pattern lebih spesifik untuk CardContent yang ada table-nya
        pattern = r'(<CardContent>)(.*?)(</CardContent>)'
        matches = list(re.finditer(pattern, content, re.DOTALL))
        
        if not matches:
            print("  ❌ Tidak menemukan CardContent")
            return False
        
        # Cari CardContent yang berisi table (ada <table)
        table_match = None
        for match in matches:
            if '<table' in match.group(2):
                table_match = match
                break
        
        if not table_match:
            print("  ❌ Tidak menemukan table di CardContent")
            return False
        
        print("  ✅ Menemukan table di CardContent")
        
        # Extract parts
        before = content[:table_match.start(2)]
        table_content = table_match.group(2).strip()
        after = content[table_match.end(2):]
        
        # Buat mobile dan desktop view
        print("  🔨 Membuat mobile view...")
        mobile_view = create_mobile_view(table_content, file_config)
        
        print("  🔨 Membuat desktop view...")
        desktop_view = create_desktop_view(table_content)
        
        # Gabungkan
        new_content = before + "\n" + mobile_view + "\n" + desktop_view + "\n                                    " + after
        
        # Tulis file baru
        write_file(file_path, new_content)
        
        print("  ✅ File berhasil diupdate!")
        print(f"  📊 Size: {len(original_content)} → {len(new_content)} bytes")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        # Restore dari backup
        print("  ♻️ Restoring dari backup...")
        shutil.copy2(backup_path, file_path)
        return False


def main():
    """
    Main function
    """
    print("=" * 70)
    print("🚀 Mobile Responsive Calendar Migration Script")
    print("=" * 70)
    print(f"\nBase Directory: {BASE_DIR}")
    print(f"Files to migrate: {len(FILES_TO_MIGRATE)}")
    
    # Konfirmasi
    print("\n⚠️  PERHATIAN:")
    print("   - Script ini akan memodifikasi file TypeScript/TSX")
    print("   - Backup otomatis akan dibuat untuk setiap file")
    print("   - Pastikan tidak ada perubahan uncommitted di Git")
    
    input("\n🤔 Tekan ENTER untuk melanjutkan atau CTRL+C untuk batal...")
    
    # Proses setiap file
    results = []
    for file_config in FILES_TO_MIGRATE:
        success = migrate_file(file_config)
        results.append({
            "name": file_config["name"],
            "success": success
        })
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 SUMMARY")
    print("=" * 70)
    
    success_count = sum(1 for r in results if r["success"])
    
    for result in results:
        status = "✅ SUCCESS" if result["success"] else "❌ FAILED"
        print(f"  {status}: {result['name']}")
    
    print(f"\n🎯 Total: {success_count}/{len(results)} berhasil")
    
    if success_count == len(results):
        print("\n🎉 Semua file berhasil dimigrate!")
        print("\n📝 Langkah selanjutnya:")
        print("   1. Test di browser (mobile & desktop mode)")
        print("   2. Verify kolom jam fixed saat scroll horizontal")
        print("   3. Pastikan semua fungsi masih bekerja")
        print("   4. Commit perubahan jika sudah OK")
    else:
        print("\n⚠️  Beberapa file gagal dimigrate.")
        print("   Periksa error message di atas dan coba manual.")
    
    print("\n" + "=" * 70)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Migration dibatalkan oleh user.")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
