# Sistem Notifikasi PWA - Jadwal Lab

## Overview
Sistem notifikasi lengkap untuk aplikasi Jadwal Lab dengan dukungan PWA (Progressive Web App) yang mencakup notifikasi browser, notifikasi bell dropdown, dan halaman manajemen notifikasi.

## Fitur Utama

### 1. **Notifikasi Real-time**
- Bell icon di header dengan badge jumlah notifikasi belum dibaca
- Dropdown notifikasi dengan daftar 10 notifikasi terbaru
- Auto-refresh setiap 30 detik
- Notifikasi in-app yang langsung terlihat

### 2. **Jenis Notifikasi**
- ✅ **Jadwal Hari Ini** - Dosen mendapat reminder jadwal mengajar hari ini
- 🔄 **Tukar Jadwal Request** - Notifikasi permintaan tukar jadwal dari dosen lain
- ✅ **Tukar Jadwal Disetujui** - Notifikasi persetujuan tukar jadwal
- ❌ **Tukar Jadwal Ditolak** - Notifikasi penolakan tukar jadwal
- 📝 **Booking Lab Request** - Admin mendapat notifikasi booking baru
- ✅ **Booking Lab Disetujui** - Dosen mendapat notifikasi booking disetujui
- ❌ **Booking Lab Ditolak** - Dosen mendapat notifikasi booking ditolak
- 📌 **Pindah Jadwal** - Notifikasi perubahan jadwal

### 3. **Halaman Notifikasi (/notifications)**
- Daftar semua notifikasi dengan pagination
- Filter notifikasi belum dibaca (highlighted dengan border biru)
- Aksi: Tandai dibaca, Hapus notifikasi
- Bulk actions: Tandai semua dibaca, Hapus semua
- Click notifikasi untuk navigasi ke halaman terkait

### 4. **PWA Support**
- Service Worker untuk offline capability
- Push notifications support
- App manifest untuk install ke home screen
- Background sync untuk update notifikasi

## File Structure

```
app/
├── Console/Commands/
│   └── SendDailyScheduleNotifications.php    # Command untuk kirim notifikasi jadwal harian
├── Http/Controllers/
│   ├── NotificationController.php            # CRUD notifikasi
│   ├── BookingLaboratoriumController.php    # Updated dengan notifikasi
│   └── TukarJadwalController.php            # Updated dengan notifikasi
├── Models/
│   ├── Notification.php                      # Model notifikasi
│   └── User.php                              # Relasi notifications
└── Services/
    └── NotificationService.php               # Service helper untuk kirim notifikasi

resources/
├── js/
│   ├── components/
│   │   ├── notification-bell.tsx            # Komponen bell icon & dropdown
│   │   ├── app-sidebar-header.tsx          # Updated dengan NotificationBell
│   │   └── ui/
│   │       └── scroll-area.tsx             # Radix UI scroll area
│   ├── hooks/
│   │   └── use-pwa.ts                      # Hook untuk PWA functions
│   ├── pages/
│   │   └── Notifications/
│   │       └── Index.tsx                    # Halaman semua notifikasi
│   └── app.tsx                              # Updated dengan service worker
└── views/
    └── app.blade.php                         # Updated dengan PWA meta tags

public/
├── service-worker.js                         # Service worker untuk PWA
└── manifest.json                             # PWA manifest

routes/
└── web.php                                   # Routes notifikasi
```

## Database Schema

```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id, is_read),
    INDEX (created_at)
);
```

## API Endpoints

### Notification Routes
```php
GET     /notifications                    # Halaman daftar notifikasi
GET     /notifications/unread            # API get notifikasi belum dibaca
POST    /notifications/{id}/read         # Tandai 1 notifikasi dibaca
POST    /notifications/read-all          # Tandai semua notifikasi dibaca
DELETE  /notifications/{id}              # Hapus 1 notifikasi
DELETE  /notifications                   # Hapus semua notifikasi
```

## Cara Penggunaan

### 1. Mengirim Notifikasi Manual

```php
use App\Services\NotificationService;

// Notifikasi Jadwal Hari Ini
NotificationService::sendJadwalHariIni($user, $jadwalData);

// Notifikasi Tukar Jadwal Request
NotificationService::sendTukarJadwalRequest($user, $tukarJadwal);

// Notifikasi Tukar Jadwal Disetujui
NotificationService::sendTukarJadwalApproved($user, $tukarJadwal);

// Notifikasi Tukar Jadwal Ditolak
NotificationService::sendTukarJadwalRejected($user, $tukarJadwal);

// Notifikasi Booking Request (ke Admin)
NotificationService::sendBookingRequest($adminUser, $booking);

// Notifikasi Booking Disetujui
NotificationService::sendBookingApproved($user, $booking);

// Notifikasi Booking Ditolak
NotificationService::sendBookingRejected($user, $booking);

// Notifikasi Pindah Jadwal
NotificationService::sendPindahJadwal($user, $sesiJadwal);
```

### 2. Notifikasi Otomatis

Notifikasi otomatis sudah terintegrasi di:
- **Booking Lab Store** → Admin mendapat notifikasi
- **Booking Lab Approve** → Dosen mendapat notifikasi
- **Booking Lab Reject** → Dosen mendapat notifikasi
- **Tukar Jadwal Store** → Mitra mendapat notifikasi (jika tukar) atau dosen sendiri (jika pindah)
- **Tukar Jadwal Approve** → Pemohon mendapat notifikasi
- **Tukar Jadwal Reject** → Pemohon mendapat notifikasi

### 3. Notifikasi Jadwal Harian (Cron Job)

Setup cron job untuk mengirim notifikasi jadwal setiap hari:

```bash
# Jalankan manual
php artisan notifications:send-daily-schedule

# Setup di cron (Linux)
0 6 * * * cd /path/to/project && php artisan notifications:send-daily-schedule

# Setup di Task Scheduler (Windows)
- Program: php
- Arguments: artisan notifications:send-daily-schedule
- Start in: D:\laragon\www\proyek_ignitepad\jadwal_lab
- Trigger: Daily at 6:00 AM
```

## PWA Installation

### Desktop
1. Buka aplikasi di browser (Chrome/Edge)
2. Klik icon install (+) di address bar
3. Atau: Menu → Install Jadwal Lab

### Mobile (Android)
1. Buka aplikasi di Chrome
2. Tap menu (⋮) → Add to Home screen
3. Konfirmasi install

### Enable Notifications
1. Browser akan meminta permission untuk notifikasi
2. Click "Allow" untuk menerima notifikasi push
3. Notifikasi akan muncul bahkan saat app tidak dibuka

## Kustomisasi

### Mengubah Interval Polling
Edit `resources/js/components/notification-bell.tsx`:
```typescript
// Ubah dari 30000 (30 detik) ke nilai yang diinginkan
const interval = setInterval(fetchNotifications, 30000);
```

### Mengubah Icon Notifikasi
Edit `getNotificationIcon()` function di:
- `resources/js/components/notification-bell.tsx`
- `resources/js/pages/Notifications/Index.tsx`

### Menambah Jenis Notifikasi Baru
1. Tambah method di `app/Services/NotificationService.php`
2. Tambah type di icon mapping
3. Trigger notifikasi di controller yang sesuai

## Testing

### Test Notifikasi Manual
```bash
# Masuk ke tinker
php artisan tinker

# Kirim notifikasi test
$user = User::find(1);
\App\Services\NotificationService::send(
    $user,
    'test',
    'Test Notification',
    'This is a test notification',
    ['link' => '/dashboard']
);
```

### Test PWA
1. Buka Developer Tools → Application
2. Check "Service Workers" untuk status
3. Check "Manifest" untuk PWA config
4. Test "Add to Home Screen" functionality

## Troubleshooting

### Notifikasi tidak muncul
- Check browser notification permission
- Check service worker status di DevTools
- Check console untuk error messages

### Badge count tidak update
- Clear cache dan reload
- Check `/notifications/unread` API response
- Check browser console untuk polling errors

### Service Worker error
```bash
# Clear service worker cache
1. Open DevTools → Application → Service Workers
2. Click "Unregister"
3. Reload page untuk re-register
```

## Browser Compatibility

✅ Chrome 90+
✅ Edge 90+
✅ Firefox 90+
✅ Safari 15+ (limited PWA support)
✅ Opera 75+

## Security Notes

- Notifikasi hanya bisa dilihat oleh user pemilik
- API endpoint dilindungi dengan auth middleware
- Delete/update notifikasi divalidasi user ownership
- CSRF protection untuk semua POST/DELETE requests

## Performance

- Notifikasi di-index pada `user_id` dan `is_read`
- Pagination untuk halaman notifikasi
- Lazy loading untuk dropdown
- Service worker cache untuk offline access
- Background sync untuk minimize data usage

## Future Enhancements

- [ ] Real-time notifications dengan Pusher/WebSocket
- [ ] Email notifications
- [ ] SMS notifications (optional)
- [ ] Notification preferences per user
- [ ] Sound notifications
- [ ] Desktop notifications dengan Notification API
- [ ] Export notifikasi ke PDF
- [ ] Advanced filters (by type, date range)

---

**Created**: November 16, 2025
**Version**: 1.0.0
**Author**: Jadwal Lab Development Team
