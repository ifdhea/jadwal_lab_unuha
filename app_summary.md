# Konsep Website Jadwal Lab UNUHA
## Laravel + React (Inertia.js) - Laravel Breeze Starter Kit

---

## 📋 SKEMA DATABASE - SISTEM PENJADWALAN LAB UNUHA

```sql
-- ============================================
-- SISTEM PENJADWALAN LAB UNUHA
-- Laravel 12 + React (Inertia.js)
-- ============================================

-- 1. STRUKTUR AKADEMIK
-- ============================================

CREATE TABLE tahun_ajaran (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(50) NOT NULL UNIQUE, -- '2024/2025'
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    is_aktif BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_aktif (is_aktif)
);

CREATE TABLE semester (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tahun_ajaran_id BIGINT UNSIGNED NOT NULL,
    nama VARCHAR(100) NOT NULL, -- 'Ganjil 2024/2025'
    tipe ENUM('ganjil', 'genap') NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    total_minggu TINYINT UNSIGNED NULL, -- otomatis dihitung
    is_aktif BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tahun_ajaran_id) REFERENCES tahun_ajaran(id) ON DELETE CASCADE,
    INDEX idx_aktif (is_aktif),
    INDEX idx_tipe (tipe)
);

-- 2. KAMPUS & FASILITAS
-- ============================================

CREATE TABLE kampus (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    kode VARCHAR(10) NOT NULL UNIQUE, -- 'B', 'C'
    nama VARCHAR(100) NOT NULL,
    alamat TEXT NULL,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE laboratorium (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    kampus_id BIGINT UNSIGNED NOT NULL,
    kode VARCHAR(20) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    kapasitas SMALLINT UNSIGNED DEFAULT 30,
    deskripsi TEXT NULL,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (kampus_id) REFERENCES kampus(id) ON DELETE CASCADE,
    UNIQUE KEY unique_kode_lab (kampus_id, kode),
    INDEX idx_kampus (kampus_id, is_aktif)
);

-- 3. PROGRAM AKADEMIK
-- ============================================

CREATE TABLE program_studi (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    kode VARCHAR(20) NOT NULL UNIQUE, -- 'IF', 'PTI'
    nama VARCHAR(100) NOT NULL,
    deskripsi TEXT NULL,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE kelas (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    program_studi_id BIGINT UNSIGNED NOT NULL,
    kampus_id BIGINT UNSIGNED NOT NULL, -- PENTING: kelas terikat kampus
    tingkat_semester TINYINT UNSIGNED NOT NULL, -- 1-8
    kode VARCHAR(20) NOT NULL, -- 'C01', 'B01'
    nama VARCHAR(100) NOT NULL, -- 'Informatika C01'
    tahun_ajaran_id BIGINT UNSIGNED NOT NULL, -- tahun angkatan
    kapasitas SMALLINT UNSIGNED DEFAULT 30,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (program_studi_id) REFERENCES program_studi(id) ON DELETE CASCADE,
    FOREIGN KEY (kampus_id) REFERENCES kampus(id) ON DELETE CASCADE,
    FOREIGN KEY (tahun_ajaran_id) REFERENCES tahun_ajaran(id) ON DELETE CASCADE,
    UNIQUE KEY unique_kode_kelas (program_studi_id, kampus_id, kode, tahun_ajaran_id),
    INDEX idx_kampus (kampus_id),
    INDEX idx_semester (tingkat_semester)
);

CREATE TABLE mata_kuliah (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    program_studi_id BIGINT UNSIGNED NOT NULL,
    kode VARCHAR(20) NOT NULL,
    nama VARCHAR(200) NOT NULL,
    sks TINYINT UNSIGNED NOT NULL, -- 2, 3, 4
    tingkat_semester TINYINT UNSIGNED NOT NULL, -- semester berapa biasanya diambil
    tipe_semester ENUM('ganjil', 'genap', 'both') DEFAULT 'both',
    butuh_lab BOOLEAN DEFAULT TRUE,
    deskripsi TEXT NULL,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (program_studi_id) REFERENCES program_studi(id) ON DELETE CASCADE,
    UNIQUE KEY unique_kode_mk (program_studi_id, kode),
    INDEX idx_semester (tingkat_semester, tipe_semester)
);

-- Relasi Many-to-Many: Kelas mengambil banyak Mata Kuliah
CREATE TABLE kelas_mata_kuliah (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    kelas_id BIGINT UNSIGNED NOT NULL,
    mata_kuliah_id BIGINT UNSIGNED NOT NULL,
    semester_id BIGINT UNSIGNED NOT NULL, -- semester akademik kapan diambil
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE,
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semester(id) ON DELETE CASCADE,
    UNIQUE KEY unique_kelas_mk (kelas_id, mata_kuliah_id, semester_id)
);

-- 4. MANAJEMEN WAKTU
-- ============================================

CREATE TABLE slot_waktu (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nomor_slot TINYINT UNSIGNED NULL, -- 1-9 (NULL untuk istirahat)
    waktu_mulai TIME NOT NULL,
    waktu_selesai TIME NOT NULL,
    is_istirahat BOOLEAN DEFAULT FALSE, -- TRUE untuk jam istirahat
    durasi_menit SMALLINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_slot (nomor_slot)
);

-- Data preset jam UNUHA (akan di-seed)
-- 1: 08:00-08:45, 2: 08:45-09:30, ..., ISTIRAHAT: 11:45-13:15, 6: 13:15-14:00, ...

-- 5. PENGGUNA & PERAN
-- ============================================

CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'dosen') NOT NULL DEFAULT 'dosen',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_role (role, is_active)
);

CREATE TABLE dosen (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    nidn VARCHAR(20) NOT NULL UNIQUE,
    nip VARCHAR(30) NULL,
    telepon VARCHAR(20) NULL,
    bisa_mengajar_kedua_kampus BOOLEAN DEFAULT TRUE, -- dosen bisa ngajar di B & C
    kampus_utama_id BIGINT UNSIGNED NULL, -- kampus utama
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (kampus_utama_id) REFERENCES kampus(id) ON DELETE SET NULL
);

CREATE TABLE mahasiswa (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL, -- bisa NULL karena mahasiswa bisa tidak punya akun
    nim VARCHAR(20) NOT NULL UNIQUE,
    nama VARCHAR(255) NOT NULL,
    kelas_id BIGINT UNSIGNED NOT NULL, -- terikat ke kelas (otomatis terikat ke kampus)
    tahun_masuk YEAR NOT NULL,
    telepon VARCHAR(20) NULL,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE,
    INDEX idx_kelas (kelas_id)
);

-- 6. JADWAL MASTER (Input Mentah)
-- ============================================

CREATE TABLE jadwal_master (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    semester_id BIGINT UNSIGNED NOT NULL,
    kelas_mata_kuliah_id BIGINT UNSIGNED NOT NULL,
    dosen_id BIGINT UNSIGNED NOT NULL,
    laboratorium_id BIGINT UNSIGNED NOT NULL,
    hari TINYINT UNSIGNED NOT NULL, -- 1=Senin, 7=Minggu
    slot_waktu_mulai_id BIGINT UNSIGNED NOT NULL,
    slot_waktu_selesai_id BIGINT UNSIGNED NOT NULL, -- untuk SKS > 1
    catatan TEXT NULL,
    ada_konflik BOOLEAN DEFAULT FALSE, -- auto-detected
    konflik_dengan JSON NULL, -- array of jadwal_master_ids
    dibuat_oleh BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (semester_id) REFERENCES semester(id) ON DELETE CASCADE,
    FOREIGN KEY (kelas_mata_kuliah_id) REFERENCES kelas_mata_kuliah(id) ON DELETE CASCADE,
    FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE CASCADE,
    FOREIGN KEY (laboratorium_id) REFERENCES laboratorium(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_waktu_mulai_id) REFERENCES slot_waktu(id),
    FOREIGN KEY (slot_waktu_selesai_id) REFERENCES slot_waktu(id),
    FOREIGN KEY (dibuat_oleh) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_konflik (semester_id, laboratorium_id, hari, slot_waktu_mulai_id, ada_konflik)
);

-- 7. JADWAL FINAL (Hasil Generate)
-- ============================================

CREATE TABLE jadwal (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    semester_id BIGINT UNSIGNED NOT NULL,
    jadwal_master_id BIGINT UNSIGNED NULL, -- referensi ke master
    kelas_mata_kuliah_id BIGINT UNSIGNED NOT NULL,
    dosen_id BIGINT UNSIGNED NOT NULL,
    laboratorium_id BIGINT UNSIGNED NOT NULL,
    kampus_id BIGINT UNSIGNED NOT NULL, -- redundant untuk query cepat
    hari TINYINT UNSIGNED NOT NULL,
    slot_waktu_mulai_id BIGINT UNSIGNED NOT NULL,
    slot_waktu_selesai_id BIGINT UNSIGNED NOT NULL,
    
    -- Sistem Rolling
    total_pertemuan TINYINT UNSIGNED NOT NULL DEFAULT 16, -- jumlah pertemuan
    pola_minggu JSON NOT NULL, -- "semua" atau [1,3,5,7,...]
    
    tanggal_efektif_mulai DATE NOT NULL,
    tanggal_efektif_selesai DATE NOT NULL,
    
    status ENUM('aktif', 'dibatalkan', 'ditukar', 'diganti') DEFAULT 'aktif',
    diganti_oleh_jadwal_id BIGINT UNSIGNED NULL,
    
    dibuat_oleh BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (semester_id) REFERENCES semester(id) ON DELETE CASCADE,
    FOREIGN KEY (jadwal_master_id) REFERENCES jadwal_master(id) ON DELETE SET NULL,
    FOREIGN KEY (kelas_mata_kuliah_id) REFERENCES kelas_mata_kuliah(id) ON DELETE CASCADE,
    FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE CASCADE,
    FOREIGN KEY (laboratorium_id) REFERENCES laboratorium(id) ON DELETE CASCADE,
    FOREIGN KEY (kampus_id) REFERENCES kampus(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_waktu_mulai_id) REFERENCES slot_waktu(id),
    FOREIGN KEY (slot_waktu_selesai_id) REFERENCES slot_waktu(id),
    FOREIGN KEY (diganti_oleh_jadwal_id) REFERENCES jadwal(id) ON DELETE SET NULL,
    FOREIGN KEY (dibuat_oleh) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_pencarian (semester_id, laboratorium_id, hari, slot_waktu_mulai_id, status),
    INDEX idx_dosen (dosen_id, status),
    INDEX idx_kampus (kampus_id, hari)
);

-- 8. SESI JADWAL (Pertemuan Individual)
-- ============================================

CREATE TABLE sesi_jadwal (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    jadwal_id BIGINT UNSIGNED NOT NULL,
    nomor_sesi TINYINT UNSIGNED NOT NULL, -- 1-18
    tanggal_sesi DATE NOT NULL, -- tanggal spesifik pertemuan
    nomor_minggu TINYINT UNSIGNED NOT NULL, -- minggu ke berapa dalam semester
    
    dosen_id BIGINT UNSIGNED NOT NULL,
    laboratorium_id BIGINT UNSIGNED NOT NULL,
    kampus_id BIGINT UNSIGNED NOT NULL,
    hari TINYINT UNSIGNED NOT NULL,
    slot_waktu_mulai_id BIGINT UNSIGNED NOT NULL,
    slot_waktu_selesai_id BIGINT UNSIGNED NOT NULL,
    
    status ENUM('terjadwal', 'dikonfirmasi', 'dosen_tidak_hadir', 'dibatalkan', 'diganti', 'selesai') DEFAULT 'terjadwal',
    
    -- Konfirmasi & Kehadiran
    dikonfirmasi_dosen_pada TIMESTAMP NULL,
    ketidakhadiran_dilaporkan_pada TIMESTAMP NULL,
    alasan_tidak_hadir TEXT NULL,
    
    -- Penggantian
    dosen_pengganti_id BIGINT UNSIGNED NULL,
    alasan_penggantian TEXT NULL,
    
    -- Tracking
    dimulai_pada TIMESTAMP NULL,
    selesai_pada TIMESTAMP NULL,
    
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (jadwal_id) REFERENCES jadwal(id) ON DELETE CASCADE,
    FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE CASCADE,
    FOREIGN KEY (laboratorium_id) REFERENCES laboratorium(id) ON DELETE CASCADE,
    FOREIGN KEY (kampus_id) REFERENCES kampus(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_waktu_mulai_id) REFERENCES slot_waktu(id),
    FOREIGN KEY (slot_waktu_selesai_id) REFERENCES slot_waktu(id),
    FOREIGN KEY (dosen_pengganti_id) REFERENCES dosen(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_sesi (jadwal_id, nomor_sesi),
    INDEX idx_tanggal (tanggal_sesi, laboratorium_id, status),
    INDEX idx_dosen (dosen_id, tanggal_sesi)
);

-- 9. PERMINTAAN TUKAR JADWAL
-- ============================================

CREATE TABLE permintaan_tukar_jadwal (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    jadwal_peminta_id BIGINT UNSIGNED NOT NULL, -- jadwal yang mau ditukar
    jadwal_tujuan_id BIGINT UNSIGNED NULL, -- jadwal tujuan (NULL jika ke slot kosong)
    
    dosen_peminta_id BIGINT UNSIGNED NOT NULL,
    dosen_tujuan_id BIGINT UNSIGNED NULL,
    
    tipe_tukar ENUM('tukar_dengan_dosen', 'pindah_ke_slot_kosong') NOT NULL,
    
    -- Data jadwal baru yang diminta
    laboratorium_baru_id BIGINT UNSIGNED NULL,
    hari_baru TINYINT UNSIGNED NULL,
    slot_waktu_baru_id BIGINT UNSIGNED NULL,
    tanggal_baru DATE NULL, -- untuk tukar spesifik 1 pertemuan
    
    tingkat_urgensi ENUM('rendah', 'sedang', 'tinggi', 'kritis') DEFAULT 'sedang',
    alasan TEXT NOT NULL,
    
    status ENUM('menunggu', 'disetujui', 'ditolak', 'dibatalkan') DEFAULT 'menunggu',
    disetujui_oleh BIGINT UNSIGNED NULL,
    disetujui_pada TIMESTAMP NULL,
    alasan_penolakan TEXT NULL,
    
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (jadwal_peminta_id) REFERENCES jadwal(id) ON DELETE CASCADE,
    FOREIGN KEY (jadwal_tujuan_id) REFERENCES jadwal(id) ON DELETE CASCADE,
    FOREIGN KEY (dosen_peminta_id) REFERENCES dosen(id) ON DELETE CASCADE,
    FOREIGN KEY (dosen_tujuan_id) REFERENCES dosen(id) ON DELETE CASCADE,
    FOREIGN KEY (laboratorium_baru_id) REFERENCES laboratorium(id) ON DELETE SET NULL,
    FOREIGN KEY (slot_waktu_baru_id) REFERENCES slot_waktu(id),
    FOREIGN KEY (disetujui_oleh) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_status (status, dosen_peminta_id),
    INDEX idx_tujuan (dosen_tujuan_id, status)
);

-- 10. PEMESANAN LAB
-- ============================================

CREATE TABLE pemesanan_lab (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    laboratorium_id BIGINT UNSIGNED NOT NULL,
    dosen_id BIGINT UNSIGNED NOT NULL,
    
    tanggal_pemesanan DATE NOT NULL,
    slot_waktu_mulai_id BIGINT UNSIGNED NOT NULL,
    slot_waktu_selesai_id BIGINT UNSIGNED NOT NULL,
    
    sesi_terkait_id BIGINT UNSIGNED NULL, -- jika pemesanan karena ada yang cancel
    
    tujuan TEXT NOT NULL,
    mata_kuliah_id BIGINT UNSIGNED NULL,
    estimasi_peserta SMALLINT UNSIGNED NULL,
    
    status ENUM('menunggu', 'disetujui', 'ditolak', 'dibatalkan', 'selesai') DEFAULT 'menunggu',
    disetujui_oleh BIGINT UNSIGNED NULL,
    disetujui_pada TIMESTAMP NULL,
    alasan_penolakan TEXT NULL,
    
    dipesan_pada TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (laboratorium_id) REFERENCES laboratorium(id) ON DELETE CASCADE,
    FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_waktu_mulai_id) REFERENCES slot_waktu(id),
    FOREIGN KEY (slot_waktu_selesai_id) REFERENCES slot_waktu(id),
    FOREIGN KEY (sesi_terkait_id) REFERENCES sesi_jadwal(id) ON DELETE SET NULL,
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE SET NULL,
    FOREIGN KEY (disetujui_oleh) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_pemesanan (laboratorium_id, tanggal_pemesanan, slot_waktu_mulai_id, status)
);

-- 11. LOG AKTIVITAS (History Real-time)
-- ============================================

CREATE TABLE log_aktivitas (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    
    tipe_loggable VARCHAR(100) NOT NULL, -- Jadwal, PermintaanTukarJadwal, dll
    id_loggable BIGINT UNSIGNED NOT NULL,
    
    aksi VARCHAR(50) NOT NULL, -- dibuat, diperbarui, ditukar, disetujui, dll
    deskripsi TEXT NOT NULL, -- human readable
    
    data_lama JSON NULL,
    data_baru JSON NULL,
    
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    is_publik BOOLEAN DEFAULT TRUE, -- tampil di public history?
    
    created_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_loggable (tipe_loggable, id_loggable),
    INDEX idx_publik (is_publik, created_at),
    INDEX idx_user (user_id, created_at)
);

-- 12. NOTIFIKASI
-- ============================================

CREATE TABLE notifikasi (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    tipe VARCHAR(100) NOT NULL, -- permintaan_tukar, pemesanan_disetujui, dll
    judul VARCHAR(255) NOT NULL,
    pesan TEXT NOT NULL,
    data JSON NULL,
    
    dibaca_pada TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_belum_dibaca (user_id, dibaca_pada, created_at)
);

-- 13. PENGATURAN SISTEM
-- ============================================

CREATE TABLE pengaturan_sistem (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `kunci` VARCHAR(100) NOT NULL UNIQUE,
    nilai JSON NOT NULL,
    deskripsi TEXT NULL,
    updated_at TIMESTAMP NULL
);
```

---

## 📁 STRUKTUR FOLDER PROJECT

```
penjadwalan-lab-unuha/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthenticatedSessionController.php
│   │   │   │   └── RegisteredUserController.php
│   │   │   │
│   │   │   ├── SuperAdmin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── TahunAjaranController.php
│   │   │   │   ├── SemesterController.php
│   │   │   │   ├── KampusController.php
│   │   │   │   ├── LaboratoriumController.php
│   │   │   │   ├── ProgramStudiController.php
│   │   │   │   ├── KelasController.php
│   │   │   │   ├── MataKuliahController.php
│   │   │   │   ├── KelasMatKulController.php
│   │   │   │   ├── SlotWaktuController.php
│   │   │   │   ├── DosenController.php
│   │   │   │   ├── MahasiswaController.php
│   │   │   │   ├── JadwalMasterController.php
│   │   │   │   ├── GeneratorJadwalController.php
│   │   │   │   └── JadwalFinalController.php
│   │   │   │
│   │   │   ├── Dosen/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── JadwalSayaController.php
│   │   │   │   ├── PermintaanTukarController.php
│   │   │   │   ├── KehadiranController.php
│   │   │   │   └── PemesananLabController.php
│   │   │   │
│   │   │   └── Publik/
│   │   │       ├── BerandaController.php
│   │   │       ├── KalenderController.php
│   │   │       └── LogAktivitasController.php
│   │   │
│   │   ├── Middleware/
│   │   │   ├── HandleInertiaRequests.php
│   │   │   ├── CekPeran.php
│   │   │   └── PastikanUserAktif.php
│   │   │
│   │   └── Requests/
│   │       ├── SuperAdmin/
│   │       │   ├── SimpanJadwalMasterRequest.php
│   │       │   ├── GenerateJadwalRequest.php
│   │       │   └── ... (requests lainnya)
│   │       └── Dosen/
│   │           ├── TukarJadwalRequest.php
│   │           └── PesanLabRequest.php
│   │
│   ├── Models/
│   │   ├── TahunAjaran.php
│   │   ├── Semester.php
│   │   ├── Kampus.php
│   │   ├── Laboratorium.php
│   │   ├── ProgramStudi.php
│   │   ├── Kelas.php
│   │   ├── MataKuliah.php
│   │   ├── KelasMatKul.php
│   │   ├── SlotWaktu.php
│   │   ├── User.php
│   │   ├── Dosen.php
│   │   ├── Mahasiswa.php
│   │   ├── JadwalMaster.php
│   │   ├── Jadwal.php
│   │   ├── SesiJadwal.php
│   │   ├── PermintaanTukarJadwal.php
│   │   ├── PemesananLab.php
│   │   ├── LogAktivitas.php
│   │   ├── Notifikasi.php
│   │   └── PengaturanSistem.php
│   │
│   ├── Services/
│   │   ├── GeneratorJadwalService.php
│   │   ├── DeteksiKonflikService.php
│   │   ├── TukarJadwalService.php
│   │   ├── PemesananLabService.php
│   │   ├── LogAktivitasService.php
│   │   └── NotifikasiService.php
│   │
│   ├── Events/
│   │   ├── PermintaanTukarDiminta.php
│   │   ├── PermintaanTukarDisetujui.php
│   │   ├── DosenTidakHadir.php
│   │   └── LabDipesan.php
│   │
│   ├── Listeners/
│   │   ├── BeritahuDosenTujuan.php
│   │   ├── BeritahuDosenPeminta.php
│   │   └── CatatAktivitasJadwal.php
│   │
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── EventServiceProvider.php
│
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_buat_tabel_tahun_ajaran.php
│   │   ├── 2024_01_01_000002_buat_tabel_semester.php
│   │   ├── 2024_01_01_000003_buat_tabel_kampus.php
│   │   ├── 2024_01_01_000004_buat_tabel_laboratorium.php
│   │   ├── 2024_01_01_000005_buat_tabel_program_studi.php
│   │   ├── 2024_01_01_000006_buat_tabel_kelas.php
│   │   ├── 2024_01_01_000007_buat_tabel_mata_kuliah.php
│   │   ├── 2024_01_01_000008_buat_tabel_kelas_mata_kuliah.php
│   │   ├── 2024_01_01_000009_buat_tabel_slot_waktu.php
│   │   ├── 2024_01_01_000010_buat_tabel_users.php
│   │   ├── 2024_01_01_000011_buat_tabel_dosen.php
│   │   ├── 2024_01_01_000012_buat_tabel_mahasiswa.php
│   │   ├── 2024_01_01_000013_buat_tabel_jadwal_master.php
│   │   ├── 2024_01_01_000014_buat_tabel_jadwal.php
│   │   ├── 2024_01_01_000015_buat_tabel_sesi_jadwal.php
│   │   ├── 2024_01_01_000016_buat_tabel_permintaan_tukar_jadwal.php
│   │   ├── 2024_01_01_000017_buat_tabel_pemesanan_lab.php
│   │   ├── 2024_01_01_000018_buat_tabel_log_aktivitas.php
│   │   ├── 2024_01_01_000019_buat_tabel_notifikasi.php
│   │   └── 2024_01_01_000020_buat_tabel_pengaturan_sistem.php
│   │
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── KampusSeeder.php
│       ├── LaboratoriumSeeder.php
│       ├── ProgramStudiSeeder.php
│       ├── SlotWaktuSeeder.php (PENTING: jam UNUHA)
│       └── SuperAdminSeeder.php
│
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── LupaPassword.jsx
│   │   │   │
│   │   │   ├── SuperAdmin/
│   │   │   │   ├── Dashboard.jsx
│   │   │```
│   │   │   │   │
│   │   │   │   ├── DataMaster/
│   │   │   │   │   ├── TahunAjaran/
│   │   │   │   │   │   ├── Index.jsx
│   │   │   │   │   │   ├── Buat.jsx
│   │   │   │   │   │   └── Ubah.jsx
│   │   │   │   │   ├── Semester/
│   │   │   │   │   ├── Kampus/
│   │   │   │   │   ├── Laboratorium/
│   │   │   │   │   ├── ProgramStudi/
│   │   │   │   │   ├── Kelas/
│   │   │   │   │   ├── MataKuliah/
│   │   │   │   │   ├── KelasMatKul/
│   │   │   │   │   ├── SlotWaktu/
│   │   │   │   │   ├── Dosen/
│   │   │   │   │   └── Mahasiswa/
│   │   │   │   │
│   │   │   │   └── Jadwal/
│   │   │   │       ├── JadwalMaster/
│   │   │   │       │   ├── Index.jsx
│   │   │   │       │   ├── Buat.jsx
│   │   │   │       │   └── Ubah.jsx
│   │   │   │       ├── Generate.jsx
│   │   │   │       └── JadwalFinal/
│   │   │   │           └── Index.jsx
│   │   │   │
│   │   │   ├── Dosen/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── JadwalSaya/
│   │   │   │   │   └── Index.jsx
│   │   │   │   ├── PermintaanTukar/
│   │   │   │   │   ├── Index.jsx
│   │   │   │   │   ├── Buat.jsx
│   │   │   │   │   └── Detail.jsx
│   │   │   │   ├── Kehadiran/
│   │   │   │   │   └── Index.jsx
│   │   │   │   └── PemesananLab/
│   │   │   │       ├── Index.jsx
│   │   │   │       └── Buat.jsx
│   │   │   │
│   │   │   └── Publik/
│   │   │       ├── Beranda.jsx
│   │   │       ├── Kalender.jsx
│   │   │       └── RiwayatAktivitas.jsx
│   │   │
│   │   ├── Components/
│   │   │   ├── Layout/
│   │   │   │   ├── AuthenticatedLayout.jsx
│   │   │   │   ├── SuperAdminLayout.jsx
│   │   │   │   ├── DosenLayout.jsx
│   │   │   │   ├── GuestLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Breadcrumb.jsx (PENTING!)
│   │   │   │
│   │   │   ├── Kalender/
│   │   │   │   ├── GridKalender.jsx
│   │   │   │   ├── SelKalender.jsx
│   │   │   │   ├── KartuJadwal.jsx
│   │   │   │   ├── ModalDetailJadwal.jsx
│   │   │   │   └── PenangananDragDrop.jsx
│   │   │   │
│   │   │   ├── Jadwal/
│   │   │   │   ├── FormJadwal.jsx
│   │   │   │   ├── FormPermintaanTukar.jsx
│   │   │   │   ├── FormPemesanan.jsx
│   │   │   │   └── IndikatorKonflik.jsx
│   │   │   │
│   │   │   └── UI/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Select.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Badge.jsx
│   │   │       ├── Table.jsx
│   │   │       ├── Toast.jsx
│   │   │       └── JudulHalaman.jsx (PENTING!)
│   │   │
│   │   ├── Hooks/
│   │   │   ├── useKalender.js
│   │   │   ├── useDragDrop.js
│   │   │   ├── useJadwal.js
│   │   │   ├── useNotifikasi.js
│   │   │   └── useBreadcrumb.js (PENTING!)
│   │   │
│   │   ├── Utils/
│   │   │   ├── helpers.js
│   │   │   ├── formatterTanggal.js
│   │   │   └── constants.js
│   │   │
│   │   └── app.jsx (entry point Inertia)
│   │
│   └── views/
│       └── app.blade.php (root template untuk Inertia)
│
├── routes/
│   ├── web.php (semua route di sini, no API)
│   ├── auth.php (dari Breeze)
│   ├── superadmin.php (grouping route superadmin)
│   └── dosen.php (grouping route dosen)
│
├── config/
│   ├── inertia.php
│   └── ...
│
├── public/
│   └── ...
│
├── composer.json
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

---

## 🌐 STRUKTUR ROUTE (routes/web.php)

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Publik\BerandaController;
use App\Http\Controllers\Publik\KalenderController;
use App\Http\Controllers\Publik\LogAktivitasController;

// ============================================
// ROUTE PUBLIK (Tanpa Autentikasi)
// ============================================

Route::get('/', [BerandaController::class, 'index'])->name('publik.beranda');
Route::get('/kalender', [KalenderController::class, 'index'])->name('publik.kalender');
Route::get('/kalender/minggu/{minggu}', [KalenderController::class, 'perMinggu'])->name('publik.kalender.minggu');
Route::get('/kalender/kampus/{kampusId}', [KalenderController::class, 'perKampus'])->name('publik.kalender.kampus');
Route::get('/jadwal/{id}', [KalenderController::class, 'detail'])->name('publik.jadwal.detail');
Route::get('/riwayat-aktivitas', [LogAktivitasController::class, 'index'])->name('publik.riwayat-aktivitas');

// ============================================
// ROUTE AUTENTIKASI (Laravel Breeze)
// ============================================

require __DIR__.'/auth.php';

// ============================================
// ROUTE SUPERADMIN
// ============================================

Route::middleware(['auth', 'role:superadmin'])->prefix('superadmin')->name('superadmin.')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\SuperAdmin\DashboardController::class, 'index'])
        ->name('dashboard');
    
    // Tahun Ajaran
    Route::resource('tahun-ajaran', App\Http\Controllers\SuperAdmin\TahunAjaranController::class);
    Route::post('tahun-ajaran/{id}/aktifkan', [App\Http\Controllers\SuperAdmin\TahunAjaranController::class, 'aktifkan'])
        ->name('tahun-ajaran.aktifkan');
    
    // Semester
    Route::resource('semester', App\Http\Controllers\SuperAdmin\SemesterController::class);
    Route::post('semester/{id}/aktifkan', [App\Http\Controllers\SuperAdmin\SemesterController::class, 'aktifkan'])
        ->name('semester.aktifkan');
    
    // Kampus
    Route::resource('kampus', App\Http\Controllers\SuperAdmin\KampusController::class);
    
    // Laboratorium
    Route::resource('laboratorium', App\Http\Controllers\SuperAdmin\LaboratoriumController::class);
    Route::get('laboratorium/kampus/{kampusId}', [App\Http\Controllers\SuperAdmin\LaboratoriumController::class, 'perKampus'])
        ->name('laboratorium.per-kampus');
    
    // Program Studi
    Route::resource('program-studi', App\Http\Controllers\SuperAdmin\ProgramStudiController::class);
    
    // Kelas
    Route::resource('kelas', App\Http\Controllers\SuperAdmin\KelasController::class);
    Route::get('kelas/kampus/{kampusId}', [App\Http\Controllers\SuperAdmin\KelasController::class, 'perKampus'])
        ->name('kelas.per-kampus');
    Route::get('kelas/program/{programId}', [App\Http\Controllers\SuperAdmin\KelasController::class, 'perProgram'])
        ->name('kelas.per-program');
    
    // Mata Kuliah
    Route::resource('mata-kuliah', App\Http\Controllers\SuperAdmin\MataKuliahController::class);
    Route::get('mata-kuliah/program/{programId}', [App\Http\Controllers\SuperAdmin\MataKuliahController::class, 'perProgram'])
        ->name('mata-kuliah.per-program');
    Route::get('mata-kuliah/semester/{tingkatSemester}/{tipe}', [App\Http\Controllers\SuperAdmin\MataKuliahController::class, 'perSemester'])
        ->name('mata-kuliah.per-semester');
    
    // Kelas-Mata Kuliah (Penugasan)
    Route::resource('kelas-matkul', App\Http\Controllers\SuperAdmin\KelasMatKulController::class);
    Route::post('kelas-matkul/penugasan-massal', [App\Http\Controllers\SuperAdmin\KelasMatKulController::class, 'penugasanMassal'])
        ->name('kelas-matkul.penugasan-massal');
    
    // Slot Waktu
    Route::resource('slot-waktu', App\Http\Controllers\SuperAdmin\SlotWaktuController::class);
    
    // Dosen
    Route::resource('dosen', App\Http\Controllers\SuperAdmin\DosenController::class);
    Route::post('dosen/{id}/toggle-status', [App\Http\Controllers\SuperAdmin\DosenController::class, 'toggleStatus'])
        ->name('dosen.toggle-status');
    
    // Mahasiswa
    Route::resource('mahasiswa', App\Http\Controllers\SuperAdmin\MahasiswaController::class);
    Route::post('mahasiswa/impor', [App\Http\Controllers\SuperAdmin\MahasiswaController::class, 'impor'])
        ->name('mahasiswa.impor');
    Route::get('mahasiswa/kelas/{kelasId}', [App\Http\Controllers\SuperAdmin\MahasiswaController::class, 'perKelas'])
        ->name('mahasiswa.per-kelas');
    
    // Jadwal Master (Input Mentah)
    Route::resource('jadwal-master', App\Http\Controllers\SuperAdmin\JadwalMasterController::class);
    Route::post('jadwal-master/buat-massal', [App\Http\Controllers\SuperAdmin\JadwalMasterController::class, 'buatMassal'])
        ->name('jadwal-master.buat-massal');
    Route::post('jadwal-master/deteksi-konflik', [App\Http\Controllers\SuperAdmin\JadwalMasterController::class, 'deteksiKonflik'])
        ->name('jadwal-master.deteksi-konflik');
    Route::get('jadwal-master/konflik/daftar', [App\Http\Controllers\SuperAdmin\JadwalMasterController::class, 'daftarKonflik'])
        ->name('jadwal-master.konflik');
    
    // Generator Jadwal
    Route::get('jadwal/generate', [App\Http\Controllers\SuperAdmin\GeneratorJadwalController::class, 'index'])
        ->name('jadwal.generate');
    Route::post('jadwal/generate', [App\Http\Controllers\SuperAdmin\GeneratorJadwalController::class, 'generate'])
        ->name('jadwal.generate.proses');
    Route::get('jadwal/generate/pratinjau', [App\Http\Controllers\SuperAdmin\GeneratorJadwalController::class, 'pratinjau'])
        ->name('jadwal.generate.pratinjau');
    
    // Jadwal Final (Lihat & Kelola)
    Route::resource('jadwal', App\Http\Controllers\SuperAdmin\JadwalFinalController::class)
        ->only(['index', 'show', 'destroy']);
    Route::post('jadwal/{id}/batalkan', [App\Http\Controllers\SuperAdmin\JadwalFinalController::class, 'batalkan'])
        ->name('jadwal.batalkan');
    Route::get('jadwal/kalender/tampilan', [App\Http\Controllers\SuperAdmin\JadwalFinalController::class, 'tampilanKalender'])
        ->name('jadwal.tampilan-kalender');
    
    // Manajemen Permintaan Tukar
    Route::get('permintaan-tukar', [App\Http\Controllers\SuperAdmin\PermintaanTukarController::class, 'index'])
        ->name('permintaan-tukar.index');
    Route::get('permintaan-tukar/{id}', [App\Http\Controllers\SuperAdmin\PermintaanTukarController::class, 'detail'])
        ->name('permintaan-tukar.detail');
    
    // Manajemen Pemesanan Lab
    Route::get('pemesanan-lab', [App\Http\Controllers\SuperAdmin\PemesananLabController::class, 'index'])
        ->name('pemesanan-lab.index');
    Route::post('pemesanan-lab/{id}/setujui', [App\Http\Controllers\SuperAdmin\PemesananLabController::class, 'setujui'])
        ->name('pemesanan-lab.setujui');
    Route::post('pemesanan-lab/{id}/tolak', [App\Http\Controllers\SuperAdmin\PemesananLabController::class, 'tolak'])
        ->name('pemesanan-lab.tolak');
    
    // Log Aktivitas
    Route::get('log-aktivitas', [App\Http\Controllers\SuperAdmin\LogAktivitasController::class, 'index'])
        ->name('log-aktivitas.index');
    
    // Pengaturan Sistem
    Route::get('pengaturan', [App\Http\Controllers\SuperAdmin\PengaturanController::class, 'index'])
        ->name('pengaturan.index');
    Route::post('pengaturan', [App\Http\Controllers\SuperAdmin\PengaturanController::class, 'perbarui'])
        ->name('pengaturan.perbarui');
});

// ============================================
// ROUTE DOSEN
// ============================================

Route::middleware(['auth', 'role:dosen'])->prefix('dosen')->name('dosen.')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Dosen\DashboardController::class, 'index'])
        ->name('dashboard');
    
    // Jadwal Saya
    Route::get('/jadwal-saya', [App\Http\Controllers\Dosen\JadwalSayaController::class, 'index'])
        ->name('jadwal-saya.index');
    Route::get('/jadwal-saya/kalender', [App\Http\Controllers\Dosen\JadwalSayaController::class, 'kalender'])
        ->name('jadwal-saya.kalender');
    Route::get('/jadwal-saya/minggu/{minggu}', [App\Http\Controllers\Dosen\JadwalSayaController::class, 'perMinggu'])
        ->name('jadwal-saya.minggu');
    
    // Kehadiran
    Route::get('/kehadiran', [App\Http\Controllers\Dosen\KehadiranController::class, 'index'])
        ->name('kehadiran.index');
    Route::post('/kehadiran/konfirmasi/{sesiId}', [App\Http\Controllers\Dosen\KehadiranController::class, 'konfirmasi'])
        ->name('kehadiran.konfirmasi');
    Route::post('/kehadiran/laporkan-tidak-hadir/{sesiId}', [App\Http\Controllers\Dosen\KehadiranController::class, 'laporkanTidakHadir'])
        ->name('kehadiran.laporkan-tidak-hadir');
    
    // Permintaan Tukar Jadwal
    Route::resource('permintaan-tukar', App\Http\Controllers\Dosen\PermintaanTukarController::class);
    Route::post('permintaan-tukar/{id}/setujui', [App\Http\Controllers\Dosen\PermintaanTukarController::class, 'setujui'])
        ->name('permintaan-tukar.setujui');
    Route::post('permintaan-tukar/{id}/tolak', [App\Http\Controllers\Dosen\PermintaanTukarController::class, 'tolak'])
        ->name('permintaan-tukar.tolak');
    Route::get('permintaan-tukar/diterima/daftar', [App\Http\Controllers\Dosen\PermintaanTukarController::class, 'diterima'])
        ->name('permintaan-tukar.diterima');
    
    // Pemesanan Lab
    Route::resource('pemesanan-lab', App\Http\Controllers\Dosen\PemesananLabController::class);
    Route::get('pemesanan-lab/slot-tersedia/cari', [App\Http\Controllers\Dosen\PemesananLabController::class, 'slotTersedia'])
        ->name('pemesanan-lab.slot-tersedia');
    Route::post('pemesanan-lab/{id}/batalkan', [App\Http\Controllers\Dosen\PemesananLabController::class, 'batalkan'])
        ->name('pemesanan-lab.batalkan');
    
    // Notifikasi
    Route::get('/notifikasi', [App\Http\Controllers\Dosen\NotifikasiController::class, 'index'])
        ->name('notifikasi.index');
    Route::post('/notifikasi/{id}/tandai-dibaca', [App\Http\Controllers\Dosen\NotifikasiController::class, 'tandaiDibaca'])
        ->name('notifikasi.tandai-dibaca');
    Route::post('/notifikasi/tandai-semua-dibaca', [App\Http\Controllers\Dosen\NotifikasiController::class, 'tandaiSemuaDibaca'])
        ->name('notifikasi.tandai-semua-dibaca');
});
```

---

## 🎯 MIDDLEWARE: CekPeran

```php
<?php

// app/Http/Middleware/CekPeran.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CekPeran
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        if (!in_array($request->user()->role, $roles)) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        return $next($request);
    }
}

// Register middleware di bootstrap/app.php (Laravel 11+)

->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\CekPeran::class,
    ]);
})
```

---

## 📦 MODEL INTI - SISTEM PENJADWALAN LAB UNUHA

```php
<?php

// ============================================
// MODEL INTI - SISTEM PENJADWALAN LAB UNUHA
// ============================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

// 1. MODEL JADWAL (Jadwal Final)
// ============================================

class Jadwal extends Model
{
    protected $table = 'jadwal';
    
    protected $fillable = [
        'semester_id',
        'jadwal_master_id',
        'kelas_mata_kuliah_id',
        'dosen_id',
        'laboratorium_id',
        'kampus_id',
        'hari',
        'slot_waktu_mulai_id',
        'slot_waktu_selesai_id',
        'total_pertemuan',
        'pola_minggu',
        'tanggal_efektif_mulai',
        'tanggal_efektif_selesai',
        'status',
        'diganti_oleh_jadwal_id',
        'dibuat_oleh',
    ];

    protected $casts = [
        'pola_minggu' => 'array',
        'tanggal_efektif_mulai' => 'date',
        'tanggal_efektif_selesai' => 'date',
    ];

    // Relasi
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function jadwalMaster(): BelongsTo
    {
        return $this->belongsTo(JadwalMaster::class, 'jadwal_master_id');
    }

    public function kelasMatKul(): BelongsTo
    {
        return $this->belongsTo(KelasMatKul::class, 'kelas_mata_kuliah_id');
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class);
    }

    public function laboratorium(): BelongsTo
    {
        return $this->belongsTo(Laboratorium::class);
    }

    public function kampus(): BelongsTo
    {
        return $this->belongsTo(Kampus::class);
    }

    public function slotWaktuMulai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'slot_waktu_mulai_id');
    }

    public function slotWaktuSelesai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'slot_waktu_selesai_id');
    }

    public function sesi(): HasMany
    {
        return $this->hasMany(SesiJadwal::class, 'jadwal_id');
    }

    public function digantiOleh(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class, 'diganti_oleh_jadwal_id');
    }

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    // Scope
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeUntukDosen($query, $dosenId)
    {
        return $query->where('dosen_id', $dosenId);
    }

    public function scopeUntukKampus($query, $kampusId)
    {
        return $query->where('kampus_id', $kampusId);
    }

    public function scopeUntukMinggu($query, $nomorMinggu)
    {
        return $query->where(function ($q) use ($nomorMinggu) {
            $q->where('pola_minggu', 'semua')
              ->orWhereJsonContains('pola_minggu', $nomorMinggu);
        });
    }

    // Method Helper
    public function getRentangWaktuLengkap(): string
    {
        return $this->slotWaktuMulai->waktu_mulai . ' - ' . $this->slotWaktuSelesai->waktu_selesai;
    }

    public function getNamaHari(): string
    {
        $hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return $hari[$this->hari] ?? 'Tidak Diketahui';
    }

    public function isSemuaMinggu(): bool
    {
        return $this->pola_minggu === 'semua';
    }

    public function getTampilanPolaMinggu(): string
    {
        if ($this->isSemuaMinggu()) {
            return 'Setiap Minggu';
        }

        if (is_array($this->pola_minggu)) {
            return 'Minggu: ' . implode(', ', $this->pola_minggu);
        }

        return 'Kustom';
    }
}

// 2. MODEL SESI JADWAL (Pertemuan Individual)
// ============================================

class SesiJadwal extends Model
{
    protected $table = 'sesi_jadwal';
    
    protected $fillable = [
        'jadwal_id',
        'nomor_sesi',
        'tanggal_sesi',
        'nomor_minggu',
        'dosen_id',
        'laboratorium_id',
        'kampus_id',
        'hari',
        'slot_waktu_mulai_id',
        'slot_waktu_selesai_id',
        'status',
        'dikonfirmasi_dosen_pada',
        'ketidakhadiran_dilaporkan_pada',
        'alasan_tidak_hadir',
        'dosen_pengganti_id',
        'alasan_penggantian',
        'dimulai_pada',
        'selesai_pada',
    ];

    protected $casts = [
        'tanggal_sesi' => 'date',
        'dikonfirmasi_dosen_pada' => 'datetime',
        'ketidakhadiran_dilaporkan_pada' => 'datetime',
        'dimulai_pada' => 'datetime',
        'selesai_pada' => 'datetime',
    ];

    // Relasi
    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class);
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class);
    }

    public function dosenPengganti(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'dosen_pengganti_id');
    }

    public function laboratorium(): BelongsTo
    {
        return $this->belongsTo(Laboratorium::class);
    }

    public function kampus(): BelongsTo
    {
        return $this->belongsTo(Kampus::class);
    }

    public function slotWaktuMulai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'slot_waktu_mulai_id');
    }

    public function slotWaktuSelesai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'slot_waktu_selesai_id');
    }

    public function pemesanan(): HasMany
    {
        return $this->hasMany(PemesananLab::class, 'sesi_terkait_id');
    }

    // Scope
    public function scopeMendatang($query)
    {
        return $query->where('tanggal_sesi', '>=', now()->toDateString())
                     ->where('status', 'terjadwal');
    }

    public function scopeHariIni($query)
    {
        return $query->where('tanggal_sesi', now()->toDateString());
    }

    public function scopePerluKonfirmasi($query)
    {
        return $query->where('tanggal_sesi', '<=', now()->toDateString())
                     ->where('status', 'terjadwal')
                     ->whereNull('dikonfirmasi_dosen_pada');
    }

    // Method Helper
    public function isHariIni(): bool
    {
        return $this->tanggal_sesi->isToday();
    }

    public function bisaDikonfirmasi(): bool
    {
        return $this->status === 'terjadwal' && 
               $this->tanggal_sesi->lte(now()) &&
               is_null($this->dikonfirmasi_dosen_pada);
    }

    public function tandaiTidakHadir(string $alasan): void
    {
        $this->update([
            'status' => 'dosen_tidak_hadir',
            'ketidakhadiran_dilaporkan_pada' => now(),
            'alasan_tidak_hadir' => $alasan,
        ]);
    }

    public function konfirmasi(): void
    {
        $this->update([
            'status' => 'dikonfirmasi',
            'dikonfirmasi_dosen_pada' => now(),
        ]);
    }
}

// 3. MODEL KELAS MATA KULIAH (Relasi MK ke Kelas)
// ============================================

class KelasMatKul extends Model
{
    protected $table = 'kelas_mata_kuliah';
    
    protected $fillable = [
        'kelas_id',
        'mata_kuliah_id',
        'semester_id',
    ];

    // Relasi
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function jadwalMaster(): HasMany
    {
        return $this->hasMany(JadwalMaster::class, 'kelas_mata_kuliah_id');
    }

    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'kelas_mata_kuliah_id');
    }

    // Method Helper
    ```php
    public function getNamaLengkap(): string
    {
        return "{$this->kelas->nama} - {$this->mataKuliah->nama}";
    }

    public function getKampus()
    {
        return $this->kelas->kampus;
    }
}

// 4. MODEL JADWAL MASTER
// ============================================

class JadwalMaster extends Model
{
    protected $table = 'jadwal_master';
    
    protected $fillable = [
        'semester_id',
        'kelas_mata_kuliah_id',
        'dosen_id',
        'laboratorium_id',
        'hari',
        'slot_waktu_mulai_id',
        'slot_waktu_selesai_id',
        'catatan',
        'ada_konflik',
        'konflik_dengan',
        'dibuat_oleh',
    ];

    protected $casts = [
        'ada_konflik' => 'boolean',
        'konflik_dengan' => 'array',
    ];

    // Relasi
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function kelasMatKul(): BelongsTo
    {
        return $this->belongsTo(KelasMatKul::class, 'kelas_mata_kuliah_id');
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class);
    }

    public function laboratorium(): BelongsTo
    {
        return $this->belongsTo(Laboratorium::class);
    }

    public function slotWaktuMulai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'slot_waktu_mulai_id');
    }

    public function slotWaktuSelesai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'slot_waktu_selesai_id');
    }

    public function jadwalYangDigenerate(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'jadwal_master_id');
    }

    // Scope
    public function scopeKonflik($query)
    {
        return $query->where('ada_konflik', true);
    }

    public function scopeTanpaKonflik($query)
    {
        return $query->where('ada_konflik', false);
    }

    // Method Helper
    public function getJadwalYangBentrok()
    {
        if (!$this->ada_konflik || !$this->konflik_dengan) {
            return collect([]);
        }

        return static::whereIn('id', $this->konflik_dengan)->get();
    }

    public function cekKompatibilitasKampus(): bool
    {
        $kampusKelasId = $this->kelasMatKul->kelas->kampus_id;
        $kampusLabId = $this->laboratorium->kampus_id;

        return $kampusKelasId === $kampusLabId;
    }
}

// 5. MODEL KELAS
// ============================================

class Kelas extends Model
{
    protected $table = 'kelas';

    protected $fillable = [
        'program_studi_id',
        'kampus_id',
        'tingkat_semester',
        'kode',
        'nama',
        'tahun_ajaran_id',
        'kapasitas',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
    ];

    // Relasi
    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }

    public function kampus(): BelongsTo
    {
        return $this->belongsTo(Kampus::class);
    }

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }

    public function mahasiswa(): HasMany
    {
        return $this->hasMany(Mahasiswa::class, 'kelas_id');
    }

    public function kelasMatKul(): HasMany
    {
        return $this->hasMany(KelasMatKul::class, 'kelas_id');
    }

    public function mataKuliah(): BelongsToMany
    {
        return $this->belongsToMany(MataKuliah::class, 'kelas_mata_kuliah', 'kelas_id', 'mata_kuliah_id')
                    ->withPivot('semester_id')
                    ->withTimestamps();
    }

    // Scope
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    public function scopeUntukKampus($query, $kampusId)
    {
        return $query->where('kampus_id', $kampusId);
    }

    // Method Helper
    public function getNamaLengkap(): string
    {
        return "{$this->programStudi->kode} {$this->kode} - Semester {$this->tingkat_semester}";
    }
}

// 6. MODEL LABORATORIUM
// ============================================

class Laboratorium extends Model
{
    protected $table = 'laboratorium';
    
    protected $fillable = [
        'kampus_id',
        'kode',
        'nama',
        'kapasitas',
        'deskripsi',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
    ];

    // Relasi
    public function kampus(): BelongsTo
    {
        return $this->belongsTo(Kampus::class);
    }

    public function jadwalMaster(): HasMany
    {
        return $this->hasMany(JadwalMaster::class, 'laboratorium_id');
    }

    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'laboratorium_id');
    }

    public function sesi(): HasMany
    {
        return $this->hasMany(SesiJadwal::class, 'laboratorium_id');
    }

    public function pemesanan(): HasMany
    {
        return $this->hasMany(PemesananLab::class, 'laboratorium_id');
    }

    // Method Helper
    public function getNamaLengkap(): string
    {
        return "{$this->nama} ({$this->kampus->kode})";
    }

    public function isTersediaPada($tanggal, $slotWaktuId): bool
    {
        $adaSesi = SesiJadwal::where('laboratorium_id', $this->id)
            ->where('tanggal_sesi', $tanggal)
            ->where('slot_waktu_mulai_id', '<=', $slotWaktuId)
            ->where('slot_waktu_selesai_id', '>=', $slotWaktuId)
            ->whereNotIn('status', ['dibatalkan', 'dosen_tidak_hadir'])
            ->exists();

        $adaPemesanan = PemesananLab::where('laboratorium_id', $this->id)
            ->where('tanggal_pemesanan', $tanggal)
            ->where('slot_waktu_mulai_id', '<=', $slotWaktuId)
            ->where('slot_waktu_selesai_id', '>=', $slotWaktuId)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->exists();

        return !$adaSesi && !$adaPemesanan;
    }
}

// 7. MODEL DOSEN
// ============================================

class Dosen extends Model
{
    protected $table = 'dosen';
    
    protected $fillable = [
        'user_id',
        'nidn',
        'nip',
        'telepon',
        'bisa_mengajar_kedua_kampus',
        'kampus_utama_id',
    ];

    protected $casts = [
        'bisa_mengajar_kedua_kampus' => 'boolean',
    ];

    // Relasi
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kampusUtama(): BelongsTo
    {
        return $this->belongsTo(Kampus::class, 'kampus_utama_id');
    }

    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'dosen_id');
    }

    public function sesi(): HasMany
    {
        return $this->hasMany(SesiJadwal::class, 'dosen_id');
    }

    public function permintaanTukarDikirim(): HasMany
    {
        return $this->hasMany(PermintaanTukarJadwal::class, 'dosen_peminta_id');
    }

    public function permintaanTukarDiterima(): HasMany
    {
        return $this->hasMany(PermintaanTukarJadwal::class, 'dosen_tujuan_id');
    }

    public function pemesanan(): HasMany
    {
        return $this->hasMany(PemesananLab::class, 'dosen_id');
    }

    // Method Helper
    public function getNama(): string
    {
        return $this->user->name;
    }

    public function bisaMengajarDi(Kampus $kampus): bool
    {
        if ($this->bisa_mengajar_kedua_kampus) {
            return true;
        }

        return $this->kampus_utama_id === $kampus->id;
    }
}
```

---

## ⚙️ SERVICE: GeneratorJadwalService

```php
<?php

namespace App\Services;

use App\Models\Jadwal;
use App\Models\SesiJadwal;
use App\Models\JadwalMaster;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class GeneratorJadwalService
{
    /**
     * Generate jadwal final dari jadwal master
     */
    public function generateJadwal(int $semesterId, int $totalPertemuan = 16): array
    {
        DB::beginTransaction();
        
        try {
            $semester = Semester::with('tahunAjaran')->findOrFail($semesterId);
            
            // 1. Validasi kelayakan
            $this->validasiKelayakanPertemuan($semester, $totalPertemuan);
            
            // 2. Ambil jadwal master yang sesuai
            $jadwalMaster = $this->getJadwalMaster($semester);
            
            if ($jadwalMaster->isEmpty()) {
                throw new \Exception('Tidak ada jadwal master untuk semester ini.');
            }
            
            // 3. Deteksi konflik
            $konflik = $this->deteksiKonflik($jadwalMaster);
            
            // 4. Hapus jadwal lama jika ada
            Jadwal::where('semester_id', $semesterId)->delete();
            
            // 5. Selesaikan konflik dengan rolling
            $jumlahKonflik = 0;
            foreach ($konflik as $grupKonflik) {
                $this->selesaikanKonflikDenganRolling($grupKonflik, $semester, $totalPertemuan);
                $jumlahKonflik += $grupKonflik->count();
            }
            
            // 6. Generate jadwal untuk non-konflik
            $tanpaKonflik = $jadwalMaster->filter(fn($m) => !$m->ada_konflik);
            foreach ($tanpaKonflik as $master) {
                $this->buatJadwalDariMaster($master, $semester, $totalPertemuan, 'semua');
            }
            
            DB::commit();
            
            $totalJadwal = Jadwal::where('semester_id', $semesterId)->count();
            
            return [
                'sukses' => true,
                'pesan' => "Jadwal berhasil digenerate untuk {$totalPertemuan} pertemuan",
                'data' => [
                    'total_jadwal' => $totalJadwal,
                    'total_konflik_diselesaikan' => $jumlahKonflik,
                    'jadwal_master_diproses' => $jadwalMaster->count(),
                ]
            ];
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Validasi apakah jumlah pertemuan layak
     */
    private function validasiKelayakanPertemuan(Semester $semester, int $totalPertemuan): void
    {
        $tanggalMulai = Carbon::parse($semester->tanggal_mulai);
        $tanggalSelesai = Carbon::parse($semester->tanggal_selesai);
        
        $totalMinggu = $tanggalMulai->diffInWeeks($tanggalSelesai);
        
        if ($totalPertemuan > $totalMinggu) {
            throw new \Exception(
                "Jumlah pertemuan ({$totalPertemuan}) melebihi durasi semester ({$totalMinggu} minggu). " .
                "Maksimal pertemuan: {$totalMinggu}"
            );
        }
        
        // Update total_minggu di semester
        if (!$semester->total_minggu || $semester->total_minggu != $totalMinggu) {
            $semester->update(['total_minggu' => $totalMinggu]);
        }
    }
    
    /**
     * Ambil jadwal master yang sesuai dengan tipe semester
     */
    private function getJadwalMaster(Semester $semester): Collection
    {
        return JadwalMaster::where('semester_id', $semester->id)
            ->whereHas('kelasMatKul.mataKuliah', function($q) use ($semester) {
                $q->where(function($query) use ($semester) {
                    $query->where('tipe_semester', $semester->tipe)
                          ->orWhere('tipe_semester', 'both');
                });
            })
            ->with([
                'kelasMatKul.mataKuliah',
                'kelasMatKul.kelas.kampus',
                'laboratorium.kampus',
                'dosen.user',
                'slotWaktuMulai',
                'slotWaktuSelesai'
            ])
            ->get();
    }
    
    /**
     * Deteksi konflik berdasarkan lab + hari + waktu
     */
    private function deteksiKonflik(Collection $jadwalMaster): Collection
    {
        $konflik = collect();
        
        // Group by: laboratorium_id + hari + slot_waktu_mulai
        $dikelompokkan = $jadwalMaster->groupBy(function($item) {
            return implode('-', [
                $item->laboratorium_id,
                $item->hari,
                $item->slot_waktu_mulai_id,
                $item->slot_waktu_selesai_id
            ]);
        });
        
        foreach ($dikelompokkan as $kunci => $grup) {
            if ($grup->count() > 1) {
                $konflik->push($grup);
                
                // Tandai sebagai konflik
                $idKonflik = $grup->pluck('id')->toArray();
                foreach ($grup as $jadwal) {
                    $idLainnya = array_values(array_diff($idKonflik, [$jadwal->id]));
                    $jadwal->update([
                        'ada_konflik' => true,
                        'konflik_dengan' => $idLainnya
                    ]);
                }
            } else {
                // Tandai tidak ada konflik
                $grup->first()->update([
                    'ada_konflik' => false,
                    'konflik_dengan' => null
                ]);
            }
        }
        
        return $konflik;
    }
    
    /**
     * Selesaikan konflik dengan sistem rolling
     */
    private function selesaikanKonflikDenganRolling(
        Collection $grupKonflik, 
        Semester $semester, 
        int $totalPertemuan
    ): void {
        $jumlah = $grupKonflik->count();
        
        // Generate pola minggu
        $polaMinggu = $this->generatePolaMinggu($jumlah, $totalPertemuan);
        
        foreach ($grupKonflik as $index => $master) {
            $this->buatJadwalDariMaster(
                $master, 
                $semester, 
                $totalPertemuan, 
                $polaMinggu[$index]
            );
        }
    }
    
    /**
     * Generate pola minggu untuk rolling
     * 
     * Contoh:
     * - 2 konflik: [1,3,5,7,...] dan [2,4,6,8,...]
     * - 3 konflik: [1,4,7,10,...], [2,5,8,11,...], [3,6,9,12,...]
     */
    private function generatePolaMinggu(int $jumlahKonflik, int $totalPertemuan): array
    {
        $pola = [];
        
        for ($i = 0; $i < $jumlahKonflik; $i++) {
            $polaMinggu = [];
            $minggu = $i + 1;
            
            while ($minggu <= $totalPertemuan) {
                $polaMinggu[] = $minggu;
                $minggu += $jumlahKonflik;
            }
            
            $pola[] = $polaMinggu;
        }
        
        return $pola;
    }
    
    /**
     * Buat jadwal dari jadwal master
     */
    private function buatJadwalDariMaster(
        JadwalMaster $master, 
        Semester $semester, 
        int $totalPertemuan, 
        $polaMinggu
    ): Jadwal {
        $tanggalMulai = Carbon::parse($semester->tanggal_mulai);
        $tanggalSelesai = Carbon::parse($semester->tanggal_selesai);
        
        // Validasi kompatibilitas kampus
        if (!$this->validasiKompatibilitasKampus($master)) {
            throw new \Exception(
                "Kelas {$master->kelasMatKul->kelas->kode} (Kampus {$master->kelasMatKul->kelas->kampus->kode}) " .
                "tidak bisa dijadwalkan di {$master->laboratorium->nama} (Kampus {$master->laboratorium->kampus->kode})"
            );
        }
        
        // Buat jadwal
        $jadwal = Jadwal::create([
            'semester_id' => $semester->id,
            'jadwal_master_id' => $master->id,
            'kelas_mata_kuliah_id' => $master->kelas_mata_kuliah_id,
            'dosen_id' => $master->dosen_id,
            'laboratorium_id' => $master->laboratorium_id,
            'kampus_id' => $master->laboratorium->kampus_id,
            'hari' => $master->hari,
            'slot_waktu_mulai_id' => $master->slot_waktu_mulai_id,
            'slot_waktu_selesai_id' => $master->slot_waktu_selesai_id,
            'total_pertemuan' => $totalPertemuan,
            'pola_minggu' => $polaMinggu === 'semua' ? 'semua' : json_encode($polaMinggu),
            'tanggal_efektif_mulai' => $tanggalMulai,
            'tanggal_efektif_selesai' => $tanggalSelesai,
            'status' => 'aktif',
            'dibuat_oleh' => auth()->id()
        ]);
        
        // Generate sesi
        $this->generateSesiJadwal($jadwal, $tanggalMulai, $tanggalSelesai, $polaMinggu);
        
        // Log aktivitas
        app(LogAktivitasService::class)->catat(
            tipeLoggable: Jadwal::class,
            idLoggable: $jadwal->id,
            aksi: 'dibuat',
            deskripsi: "Jadwal digenerate: {$master->kelasMatKul->mataKuliah->nama} - {$master->kelasMatKul->kelas->kode}",
            isPublik: true
        );
        
        return $jadwal;
    }
    
    /**
     * Validasi apakah kelas dan lab di kampus yang sama
     */
    private function validasiKompatibilitasKampus(JadwalMaster $master): bool
    {
        $kampusKelasId = $master->kelasMatKul->kelas->kampus_id;
        $kampusLabId = $master->laboratorium->kampus_id;
        
        return $kampusKelasId === $kampusLabId;
    }
    
    /**
     * Generate sesi jadwal untuk setiap pertemuan
     */
    private function generateSesiJadwal(
        Jadwal $jadwal, 
        Carbon $tanggalMulai, 
        Carbon $tanggalSelesai, 
        $polaMinggu
    ): void {
        $tanggalSekarang = $tanggalMulai->copy();
        $nomorSesi = 1;
        $nomorMinggu = 1;
        
        // Tentukan hari target (1=Senin, ..., 7=Minggu)
        $hariTarget = $jadwal->hari;
        
        // Maju ke hari target pertama kali
        // Carbon: 0=Sunday, 6=Saturday
        // System kita: 1=Senin, 7=Minggu
        $hariCarbon = $hariTarget == 7 ? 0 : $hariTarget;
        
        while ($tanggalSekarang->dayOfWeek != $hariCarbon) {
            $tanggalSekarang->addDay();
        }
        
        $sesi = [];
        
        while ($tanggalSekarang->lte($tanggalSelesai) && $nomorSesi <= $jadwal->total_pertemuan) {
            // Cek apakah minggu ini termasuk dalam pola_minggu
            $harusDijadwalkan = false;
            
            if ($polaMinggu === 'semua') {
                $harusDijadwalkan = true;
            } elseif (is_array($polaMinggu)) {
                $harusDijadwalkan = in_array($nomorMinggu, $polaMinggu);
            }
            
            if ($harusDijadwalkan) {
                $sesi[] = [
                    'jadwal_id' => $jadwal->id,
                    'nomor_sesi' => $nomorSesi,
                    'tanggal_sesi' => $tanggalSekarang->format('Y-m-d'),
                    'nomor_minggu' => $nomorMinggu,
                    'dosen_id' => $jadwal->dosen_id,
                    'laboratorium_id' => $jadwal->laboratorium_id,
                    'kampus_id' => $jadwal->kampus_id,
                    'hari' => $jadwal->hari,
                    'slot_waktu_mulai_id' => $jadwal->slot_waktu_mulai_id,
                    'slot_waktu_selesai_id' => $jadwal->slot_waktu_selesai_id,
                    'status' => 'terjadwal',
                    'created_at' => now(),
                    'updated_at' => now()
                ];
                
                $nomorSesi++;
            }
            
            // Maju ke minggu berikutnya (hari yang sama)
            $tanggalSekarang->addWeek();
            $nomorMinggu++;
        }
        
        // Bulk insert sesi
        if (!empty($sesi)) {
            SesiJadwal::insert($sesi);
        }
    }
    
    /**
     * Pratinjau jadwal sebelum generate
     */
    public function pratinjauJadwal(int $semesterId, int $totalPertemuan): array
    {
        $semester = Semester::findOrFail($semesterId);
        
        // Validasi
        $this->validasiKelayakanPertemuan($semester, $totalPertemuan);
        
        // Ambil jadwal master
        $jadwalMaster = $this->getJadwalMaster($semester);
        
        // Deteksi konflik (tanpa save)
        $konflik = $this->deteksiKonflik($jadwalMaster);
        
        $pratinjau = [
            'semester' => [
                'nama' => $semester->nama,
                'tanggal_mulai' => $semester->tanggal_mulai->format('d M Y'),
                'tanggal_selesai' => $semester->tanggal_selesai->format('d M Y'),
                'total_minggu' => $semester->total_minggu,
            ],
            'total_pertemuan' => $totalPertemuan,
            'statistik' => [
                'total_jadwal_master' => $jadwalMaster->count(),
                'total_konflik' => $konflik->count(),
                'total_jadwal_konflik' => $konflik->flatten()->count(),
                'jadwal_tanpa_konflik' => $jadwalMaster->count() - $konflik->flatten()->count(),
            ],
            'konflik' => $konflik->map(function($grup) use ($totalPertemuan) {
                return [
                    'jadwal' => $grup->map(function($master) {
                        return [
                            'kelas' => $master->kelasMatKul->kelas->kode,
                            'mata_kuliah' => $master->kelasMatKul->mataKuliah->nama,
                            'dosen' => $master->dosen->user->name,
                            'lab' => $master->laboratorium->nama,
                            'hari' => $master->hari,
                            'waktu' => $master->slotWaktuMulai->waktu_mulai . ' - ' . $master->slotWaktuSelesai->waktu_selesai,
                        ];
                    }),
                    'resolusi' => $this->generatePolaMinggu($grup->count(), $totalPertemuan),
                ];
            }),
        ];
        
        return $pratinjau;
    }
}
```

---

## 📝 CATATAN PENTING

### 1. **Implementasi Breadcrumb**
- Menggunakan middleware + Inertia shared data
- Component `Breadcrumb.jsx` menerima data dari controller

### 2. **Dynamic Page Title**
- Setiap page menggunakan `<Head title="..." />` dari Inertia
- Component JudulHalaman untuk konsistensi

### 3. **Tidak Ada API Routes**
- Semua route di `routes/web.php`
- Inertia handle data passing otomatis
- Return Inertia::render() dari controller

### 4. **Autentikasi**
- Menggunakan Laravel Breeze default
- Middleware `auth` & `CekPeran` untuk proteksi route

### 5. **State Management**
- Tidak perlu Redux/Zustand
- Inertia shared data + React state cukup
- Form handling pakai `@inertiajs/react` form helper

---

## 🚀 CARA INSTALASI

```bash
# 1. Install Laravel dengan Breeze (React)
composer create-project laravel/laravel penjadwalan-lab-unuha
cd penjadwalan-lab-unuha

# 2. Install Breeze dengan React stack
composer require laravel/breeze --dev
php artisan breeze:install react

# 3. Install dependencies tambahan
npm install @headlessui/react@latest
npm install lucide-react

# 4. Setup database di .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=unuha_penjadwalan_lab
DB_USERNAME=root
DB_PASSWORD=

# 5. Buat database
mysql -u root -p
CREATE DATABASE unuha_penjadwalan_lab;

# 6. Copy semua migration files ke database/migrations/
# (gunakan schema SQL dari atas)

# 7. Jalankan migration
php artisan migrate

# 8. Seed data awal (SlotWaktu, Kampus, SuperAdmin)
php artisan db:seed

# 9. Compile assets
npm run dev

# 10. Jalankan server
php artisan serve
```

Sistem siap digunakan! 🎉