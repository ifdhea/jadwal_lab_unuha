# 🧪 PANDUAN TESTING - SISTEM JADWAL LAB UNUHA

## 🚀 QUICK START

### 1. Pastikan Server Berjalan
```bash
# Terminal 1 - Laravel Server
php artisan serve

# Terminal 2 - Vite Dev (untuk development)
npm run dev

# Atau jika sudah build (production):
# npm run build sudah dilakukan
```

### 2. Akses Aplikasi
```
URL: http://jadwal_lab.test (atau http://localhost:8000)
```

---

## 👤 AKUN TESTING

### Super Admin
```
Email: admin@unuha.ac.id
Password: password
```

### Dosen 1
```
Email: ahmad.hidayat@unuha.ac.id
Password: password
```

### Dosen 2
```
Email: siti.fatimah@unuha.ac.id
Password: password
```

---

## ✅ SKENARIO TESTING

### **SCENARIO 1: Login & Dashboard**

#### Test Super Admin Dashboard
1. ✅ Login sebagai `admin@unuha.ac.id`
2. ✅ Cek Dashboard menampilkan:
   - Statistik: Total Kampus, Lab, Prodi, Dosen, Kelas, Mata Kuliah
   - Statistik Jadwal: Total Jadwal Master, Konflik, Sesi Terjadwal
   - Penggunaan Lab per Kampus (progress bar)
   - Jadwal Hari Ini (jika ada)
3. ✅ Pastikan semua angka statistik muncul
4. ✅ Pastikan tidak ada error

#### Test Dosen Dashboard
1. ✅ Logout, login sebagai `ahmad.hidayat@unuha.ac.id`
2. ✅ Cek Dashboard menampilkan:
   - Info Profil: Nama, NIDN, Program Studi
   - Statistik: Mata Kuliah, Kelas, Total Pertemuan, Pertemuan Selesai
   - Jadwal Minggu Ini (dengan detail)
   - Jadwal Bulan Ini (scrollable)
3. ✅ Pastikan data sesuai dengan dosen yang login

**Expected Result**: ✅ Dashboard tampil sesuai role masing-masing

---

### **SCENARIO 2: Master Data CRUD**

#### Test CRUD Kampus (Contoh)
1. ✅ Login sebagai Super Admin
2. ✅ Navigate ke **Kampus** (sidebar)
3. ✅ Klik "Tambah Kampus"
4. ✅ Isi form:
   - Kode: `D`
   - Nama: `Kampus D - Test`
   - Alamat: `Jl. Testing No. 1`
   - Is Aktif: `✓`
5. ✅ Submit → Cek success message
6. ✅ Cek data muncul di list
7. ✅ Klik "Edit" → Ubah nama → Submit
8. ✅ Klik "Delete" → Konfirmasi → Deleted

**Expected Result**: ✅ CRUD berjalan tanpa error

> **Note**: Test CRUD yang sama untuk master data lain:
> - Tahun Ajaran, Semester, Laboratorium
> - Program Studi, Kelas, Mata Kuliah
> - Slot Waktu, Dosen

---

### **SCENARIO 3: Jadwal Master & Generate**

#### Test Buat Jadwal Master
1. ✅ Login sebagai Super Admin
2. ✅ Navigate ke **Jadwal Master**
3. ✅ Klik "Tambah Jadwal"
4. ✅ Isi form:
   - Kelas Mata Kuliah: Pilih yang ada
   - Dosen: Pilih dosen
   - Laboratorium: Pilih lab
   - Hari: Senin
   - Slot Mulai & Selesai: Pilih slot
5. ✅ Submit → Cek berhasil

#### Test Generate Jadwal
1. ✅ Klik button "Generate Jadwal"
2. ✅ Pilih semester aktif
3. ✅ Isi total pertemuan (misal: 16)
4. ✅ Generate → Tunggu proses
5. ✅ Cek success message
6. ✅ Navigate ke **Jadwal Final**
7. ✅ Pilih semester & minggu
8. ✅ Cek jadwal ter-generate dengan benar

**Expected Result**: ✅ Jadwal ter-generate tanpa error, konflik ter-resolve

---

### **SCENARIO 4: Tukar Jadwal**

#### Test Ajukan Tukar Jadwal (Dosen A)
1. ✅ Login sebagai `ahmad.hidayat@unuha.ac.id` (Dosen A)
2. ✅ Navigate ke **Tukar Jadwal** (sidebar menu untuk dosen)
3. ✅ Klik "Ajukan Tukar Jadwal"
4. ✅ Pilih jadwal yang ingin ditukar (dari list)
5. ✅ Pilih dosen mitra: `Siti Fatimah` (Dosen B)
6. ✅ Tunggu loading jadwal mitra di tanggal yang sama
7. ✅ Pilih jadwal mitra (jika ada)
8. ✅ Isi alasan: "Ada keperluan keluarga mendadak"
9. ✅ Submit → Cek success message
10. ✅ Cek status: **Menunggu**

#### Test Approve Tukar Jadwal (Dosen B)
1. ✅ Logout, login sebagai `siti.fatimah@unuha.ac.id` (Dosen B)
2. ✅ Navigate ke **Tukar Jadwal**
3. ✅ Cek ada permintaan dari Ahmad Hidayat
4. ✅ Klik "Setujui"
5. ✅ Konfirmasi → Submit
6. ✅ Cek success message
7. ✅ Cek status berubah: **Disetujui**

#### Verifikasi Jadwal Sudah Tertukar
1. ✅ Navigate ke **Jadwal Final**
2. ✅ Cek dosen sudah tertukar di jadwal yang dipilih
3. ✅ Login kembali sebagai Ahmad → Cek jadwal juga sudah tertukar

**Expected Result**: ✅ Jadwal berhasil ditukar, data konsisten

#### Test Reject Tukar Jadwal
1. ✅ Login sebagai Dosen A
2. ✅ Ajukan tukar jadwal baru
3. ✅ Login sebagai Dosen B (mitra)
4. ✅ Klik "Tolak"
5. ✅ Isi alasan: "Jadwal tidak bisa diganti"
6. ✅ Submit → Cek success
7. ✅ Cek status: **Ditolak**

#### Test Cancel Tukar Jadwal
1. ✅ Login sebagai Dosen A
2. ✅ Ajukan tukar jadwal baru
3. ✅ Di list, klik "Batalkan" pada permintaan yang masih menunggu
4. ✅ Konfirmasi → Cek success
5. ✅ Cek status: **Dibatalkan**

**Expected Result**: ✅ Semua aksi (approve, reject, cancel) berjalan normal

---

### **SCENARIO 5: Booking Laboratorium**

#### Test Booking Lab (Dosen)
1. ✅ Login sebagai Dosen
2. ✅ Navigate ke **Booking Lab** (sidebar)
3. ✅ Klik "Booking Lab"
4. ✅ Pilih laboratorium: "Lab Komputer B1"
5. ✅ Pilih tanggal: (besok)
6. ✅ Pilih waktu mulai: "Slot 1 (08:00-08:45)"
7. ✅ Pilih durasi: "2 slot (90 menit)"
8. ✅ Tunggu cek ketersediaan otomatis
9. ✅ Jika tersedia, isi:
   - Keperluan: "Workshop Pemrograman Python"
   - Keterangan: "Untuk mahasiswa semester 3"
10. ✅ Submit → Cek success message
11. ✅ Cek status: **Menunggu**

#### Test Cek Lab Tidak Tersedia
1. ✅ Booking lab yang sama
2. ✅ Pilih waktu yang bentrok dengan jadwal kuliah
3. ✅ Cek muncul alert: "Lab sudah terpakai pada waktu tersebut"
4. ✅ Button submit disabled

**Expected Result**: ✅ Validasi ketersediaan berjalan dengan benar

#### Test Approve Booking (Admin)
1. ✅ Logout, login sebagai Super Admin
2. ✅ Navigate ke **Booking Lab**
3. ✅ Cek ada permintaan booking dari dosen
4. ✅ Klik "Setujui"
5. ✅ (Opsional) Isi catatan admin
6. ✅ Submit → Cek success
7. ✅ Cek status: **Disetujui**

#### Test Reject Booking (Admin)
1. ✅ Login sebagai Dosen → Booking lab baru
2. ✅ Login sebagai Admin
3. ✅ Klik "Tolak" pada booking
4. ✅ Isi alasan: "Lab sedang maintenance"
5. ✅ Submit → Cek success
6. ✅ Cek status: **Ditolak** dengan catatan admin

#### Test Cancel Booking (Dosen)
1. ✅ Login sebagai Dosen
2. ✅ Navigate ke **Booking Lab**
3. ✅ Klik "Batalkan" pada booking yang menunggu/disetujui
4. ✅ Konfirmasi → Cek success
5. ✅ Cek status: **Dibatalkan**

**Expected Result**: ✅ Semua aksi booking berjalan normal

---

### **SCENARIO 6: Filter & Pagination**

#### Test Filter Status (Tukar Jadwal)
1. ✅ Navigate ke **Tukar Jadwal**
2. ✅ Pilih filter status: "Menunggu"
3. ✅ Cek hanya tampil yang menunggu
4. ✅ Pilih filter: "Disetujui"
5. ✅ Cek hanya tampil yang disetujui

#### Test Filter Tanggal (Booking Lab)
1. ✅ Navigate ke **Booking Lab**
2. ✅ Input tanggal tertentu
3. ✅ Cek hanya tampil booking di tanggal tersebut

#### Test Pagination
1. ✅ Jika data > 10 items
2. ✅ Cek pagination muncul
3. ✅ Klik halaman 2 → Data berubah
4. ✅ Klik prev/next → Berfungsi

**Expected Result**: ✅ Filter & pagination berjalan smooth

---

## 🐛 CHECKLIST ERROR HANDLING

### Form Validation
- [ ] Submit form kosong → Muncul error message
- [ ] Input invalid (email, tanggal, dll) → Validasi
- [ ] Max length tercapai → Error

### Authorization
- [ ] Dosen akses halaman admin → Redirect/403
- [ ] Guest akses halaman protected → Redirect login

### Network Error
- [ ] Koneksi internet off → Error message
- [ ] Server down → Timeout handling

---

## 📊 PERFORMANCE CHECK

### Page Load Time
- [ ] Dashboard: < 2 detik
- [ ] List pages: < 1.5 detik
- [ ] Form pages: < 1 detik

### AJAX Requests
- [ ] Check availability: < 500ms
- [ ] Get jadwal mitra: < 1 detik

### Bundle Size
- [ ] Total JS: ~355 KB (acceptable)
- [ ] Gzipped: ~115 KB (good)

---

## ✅ FINAL CHECKLIST

### Functionality
- [x] Semua CRUD berfungsi
- [x] Dashboard tampil data real
- [x] Tukar jadwal end-to-end
- [x] Booking lab end-to-end
- [x] Generate jadwal sukses
- [x] Filter & search work
- [x] Validation berjalan

### UI/UX
- [x] Responsive di mobile
- [x] Dark mode berfungsi
- [x] Icons tampil
- [x] Loading state ada
- [x] Success/error notification
- [x] Modal dialogs smooth

### Security
- [x] Auth middleware aktif
- [x] Role-based access control
- [x] CSRF protection
- [x] Input sanitization
- [x] SQL injection protected (Eloquent)

---

## 🎉 KESIMPULAN TESTING

Jika semua scenario di atas ✅ PASS, maka:

**🎊 PROJECT SIAP PRODUCTION! 🎊**

---

## 📝 CATATAN PENTING

### Known Limitations
1. Tukar jadwal hanya bisa dengan jadwal di tanggal yang sama
2. Booking lab minimal H+0 (hari ini)
3. Dosen hanya bisa cancel booking yang status menunggu/disetujui
4. Generate jadwal akan overwrite sesi_jadwal yang sudah ada

### Future Enhancements (Opsional)
1. Notifikasi email/WhatsApp
2. Export jadwal ke PDF/Excel
3. Statistik penggunaan lab
4. Riwayat perubahan jadwal
5. Mobile app (React Native)

---

**SELAMAT! PROJECT SUDAH SELESAI! 🚀**
