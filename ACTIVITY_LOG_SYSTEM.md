# Sistem Activity Log - Jadwal Lab

## Overview
Sistem activity log untuk merekam dan menampilkan semua aktivitas yang dilakukan oleh admin dan dosen. Public (mahasiswa) dapat melihat aktivitas ini untuk mengetahui perubahan jadwal, booking lab, dan aktivitas lainnya.

## Fitur Utama

### 1. **Aktivitas yang Direkam**
- 🔄 **Tukar Jadwal** - Dosen A menukar jadwal dengan Dosen B
- 📌 **Pindah Jadwal** - Dosen memindahkan jadwal ke hari/waktu lain
- ❌ **Tidak Masuk** - Dosen mengklik tidak masuk untuk jadwal tertentu
- ✅ **Booking Lab Disetujui** - Admin menyetujui booking lab dari dosen
- 🚫 **Jadwal Dibatalkan** - Admin membatalkan jadwal (jika diperlukan)

### 2. **Tampilan untuk Public**
- **Button "Aktivitas Terkini"** di halaman jadwal public
- Dialog popup yang menampilkan riwayat aktivitas 7 hari terakhir
- Format ringkas dan mudah dipahami
- Auto-refresh data terbaru
- Icon dan badge berwarna untuk setiap jenis aktivitas

### 3. **Tampilan untuk Admin & Dosen**
- **Icon Activity** di header dashboard (sebelah notifikasi)
- Dropdown/dialog menampilkan aktivitas terkini
- Terintegrasi dengan sistem notifikasi

## Database Schema

```sql
CREATE TABLE activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    data JSON NULL,
    icon VARCHAR(255) NULL,
    color VARCHAR(255) DEFAULT 'blue',
    is_public BOOLEAN DEFAULT TRUE,
    activity_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX (is_public, activity_date),
    INDEX (created_at)
);
```

## API Endpoints

```php
GET /api/activity-logs/recent?days=7    # Get aktivitas N hari terakhir (public)
GET /api/activity-logs/today            # Get aktivitas hari ini (public)
```

## File Structure

```
app/
├── Http/Controllers/
│   └── ActivityLogController.php       # API controller untuk activity logs
├── Models/
│   └── ActivityLog.php                 # Model activity log
└── Services/
    └── ActivityLogService.php          # Service helper untuk logging

resources/
├── js/
│   ├── components/
│   │   ├── activity-feed.tsx          # Komponen card activity feed
│   │   └── activity-feed-button.tsx   # Komponen button + dialog
│   ├── pages/
│   │   └── Public/
│   │       └── Jadwal.tsx             # Updated dengan activity button
│   └── app-sidebar-header.tsx         # Updated dengan activity button

routes/
└── web.php                             # Routes untuk API
```

## Cara Penggunaan

### 1. Auto-Logging (Sudah Terintegrasi)

Aktivitas otomatis dicatat saat:

```php
// Tukar Jadwal - di TukarJadwalController::approve()
ActivityLogService::logTukarJadwal($tukarJadwal);

// Pindah Jadwal - di TukarJadwalController::approve()
ActivityLogService::logPindahJadwal($tukarJadwal);

// Tidak Masuk - di SesiJadwalController::updateStatus()
ActivityLogService::logTidakMasuk($sesiJadwal, $dosen);

// Booking Lab Disetujui - di BookingLaboratoriumController::approve()
ActivityLogService::logBookingLabDisetujui($booking);

// Jadwal Dibatalkan - di SesiJadwalController::batalkan()
ActivityLogService::logJadwalDibatalkan($sesiJadwal, $adminName);
```

### 2. Manual Logging

Jika perlu log aktivitas custom:

```php
use App\Services\ActivityLogService;

ActivityLogService::log(
    $user,                      // User object (nullable)
    'Nama Actor',               // Nama yang melakukan
    'Dosen',                    // Role: Dosen, Admin
    'custom_action',            // Action identifier
    'Judul Aktivitas',          // Judul singkat
    'Deskripsi lengkap...',    // Deskripsi detail
    ['key' => 'value'],        // Data tambahan (optional)
    '🎯',                       // Icon emoji (optional)
    'green',                    // Warna: blue, green, orange, red (optional)
    true,                       // is_public (optional, default true)
    now()                       // activity_date (optional, default now)
);
```

### 3. Menampilkan Activity Feed

**Untuk Public (Mahasiswa):**
```tsx
// Di halaman jadwal public
import { ActivityFeedButton } from '@/components/activity-feed-button';

<ActivityFeedButton variant="button" days={7} />
```

**Untuk Dashboard (Admin/Dosen):**
```tsx
// Di header dashboard
import { ActivityFeedButton } from '@/components/activity-feed-button';

<ActivityFeedButton variant="icon" days={7} />
```

**Komponen Card Feed:**
```tsx
// Untuk sidebar atau section
import { ActivityFeed } from '@/components/activity-feed';

<ActivityFeed 
    days={7} 
    maxHeight="500px"
    showHeader={true}
    autoRefresh={true}
    refreshInterval={60000}
/>
```

## Jenis Aktivitas & Icon

| Action | Icon | Warna | Contoh |
|--------|------|-------|--------|
| `tukar_jadwal` | 🔄 | Blue | "Dosen A menukar jadwal MK X dengan Dosen B untuk MK Y" |
| `pindah_jadwal` | 📌 | Orange | "Dosen A memindahkan jadwal MK X ke 20 Nov 2025" |
| `tidak_masuk` | ❌ | Red | "Dosen A tidak masuk untuk MK X (Kelas A) di Lab 1" |
| `booking_lab` | ✅ | Green | "Dosen A booking Lab 1 pada 20 Nov 2025 untuk Praktikum" |
| `jadwal_dibatalkan` | 🚫 | Red | "Jadwal MK X oleh Dosen A dibatalkan oleh admin" |

## Contoh Output

### Format Ringkas (untuk mahasiswa):
```
🔄 Tukar Jadwal
Dosen Ahmad menukar jadwal Pemrograman Web di Lab Komputer 1 
dengan Dosen Budi untuk jadwal Basis Data di Lab Komputer 2

Dosen | 2 jam yang lalu
```

### Format Detail (untuk admin/dosen):
```
🔄 Tukar Jadwal                                   [Dosen]

Dosen Ahmad menukar jadwal Pemrograman Web di Lab Komputer 1 
dengan Dosen Budi untuk jadwal Basis Data di Lab Komputer 2

Kamis, 16 November 2025 pukul 10:30
```

## Kustomisasi

### Mengubah Durasi History
```tsx
// Default 7 hari, ubah sesuai kebutuhan
<ActivityFeedButton days={14} />
```

### Mengubah Interval Auto-Refresh
```tsx
<ActivityFeed 
    autoRefresh={true}
    refreshInterval={30000}  // 30 detik
/>
```

### Menambah Jenis Aktivitas Baru

1. Tambah method di `ActivityLogService.php`:
```php
public static function logCustomActivity($params)
{
    return self::log(
        $user,
        $actorName,
        $actorRole,
        'custom_action',  // unique action identifier
        'Custom Title',
        'Description here',
        $data,
        '🎯',  // icon
        'blue',  // color
        true,
        now()
    );
}
```

2. Update icon mapping di komponen React jika perlu

3. Trigger di controller yang sesuai

## Query Performance

Activity log di-index dengan baik untuk performa optimal:
```sql
-- Index untuk public query
INDEX (is_public, activity_date)

-- Index untuk sorting
INDEX (created_at)
```

Rekomendasi:
- Pagination untuk list panjang
- Cache untuk aktivitas yang sering diakses
- Cleanup data lama (> 3 bulan) jika diperlukan

## Privacy & Security

- **Public Activities**: Default semua aktivitas adalah public
- **Private Activities**: Set `is_public = false` untuk aktivitas sensitif
- **User Privacy**: Nama dosen ditampilkan, tapi tidak ada info kontak
- **Data Retention**: Pertimbangkan cleanup data lama secara berkala

## Testing

### Test Manual
```bash
php artisan tinker

# Create test activity
$user = User::first();
\App\Services\ActivityLogService::log(
    $user,
    'Test User',
    'Admin',
    'test',
    'Test Activity',
    'This is a test activity log',
    [],
    '🧪',
    'blue'
);

# Query activities
\App\Models\ActivityLog::public()->recent(7)->get();
```

### Test API
```bash
# Get recent activities
curl http://jadwal_lab.test/api/activity-logs/recent?days=7

# Get today activities
curl http://jadwal_lab.test/api/activity-logs/today
```

## Troubleshooting

### Aktivitas tidak muncul
- Check apakah `is_public = true`
- Check range tanggal (`activity_date`)
- Check API response di console browser

### Aktivitas tidak ter-update
- Refresh browser
- Check auto-refresh interval
- Check API endpoint

### Performance lambat
- Reduce `days` parameter (default 7)
- Add pagination untuk list besar
- Consider caching

## Future Enhancements

- [ ] Filter by activity type
- [ ] Filter by actor (dosen tertentu)
- [ ] Export activity logs to PDF/Excel
- [ ] Activity timeline visualization
- [ ] Push notifications untuk aktivitas penting
- [ ] Admin panel untuk manage activity logs
- [ ] Scheduled cleanup old data

---

**Created**: November 16, 2025
**Version**: 1.0.0
**Author**: Jadwal Lab Development Team
