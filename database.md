-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 13, 2025 at 01:26 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/_!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT _/;
/_!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS _/;
/_!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION _/;
/_!40101 SET NAMES utf8mb4 _/;

--
-- Database: `jadwal_lab`
--

---

--
-- Table structure for table `booking_laboratorium`
--

CREATE TABLE `booking_laboratorium` (
`id` bigint UNSIGNED NOT NULL,
`dosen_id` bigint UNSIGNED NOT NULL,
`kelas_mata_kuliah_id` bigint UNSIGNED DEFAULT NULL,
`laboratorium_id` bigint UNSIGNED NOT NULL,
`tanggal` date NOT NULL,
`slot_waktu_mulai_id` bigint UNSIGNED NOT NULL,
`slot_waktu_selesai_id` bigint UNSIGNED NOT NULL,
`durasi_slot` tinyint UNSIGNED NOT NULL DEFAULT '1',
`keperluan` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
`keterangan` text COLLATE utf8mb4_unicode_ci,
`status` enum('menunggu','disetujui','ditolak','selesai','dibatalkan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
`catatan_admin` text COLLATE utf8mb4_unicode_ci,
`diproses_oleh` bigint UNSIGNED DEFAULT NULL,
`tanggal_diajukan` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
`tanggal_diproses` timestamp NULL DEFAULT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
`key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
`expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
`key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
`id` bigint UNSIGNED NOT NULL,
`user_id` bigint UNSIGNED NOT NULL,
`nidn` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
`nip` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`program_studi_id` bigint UNSIGNED DEFAULT NULL,
`kampus_utama_id` bigint UNSIGNED DEFAULT NULL,
`gelar_depan` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`gelar_belakang` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`no_telp` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`alamat` text COLLATE utf8mb4_unicode_ci,
`is_aktif` tinyint(1) NOT NULL DEFAULT '1',
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
`id` bigint UNSIGNED NOT NULL,
`uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
`queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
`payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
`exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
`failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `jadwal_master`
--

CREATE TABLE `jadwal_master` (
`id` bigint UNSIGNED NOT NULL,
`kelas_mata_kuliah_id` bigint UNSIGNED NOT NULL,
`dosen_id` bigint UNSIGNED NOT NULL,
`laboratorium_id` bigint UNSIGNED NOT NULL,
`hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu') COLLATE utf8mb4_unicode_ci NOT NULL,
`slot_waktu_mulai_id` bigint UNSIGNED NOT NULL,
`slot_waktu_selesai_id` bigint UNSIGNED NOT NULL,
`durasi_slot` tinyint UNSIGNED NOT NULL DEFAULT '1',
`status_konflik` enum('bebas','konflik') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'bebas',
`pola_minggu` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
`id` bigint UNSIGNED NOT NULL,
`queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
`attempts` tinyint UNSIGNED NOT NULL,
`reserved_at` int UNSIGNED DEFAULT NULL,
`available_at` int UNSIGNED NOT NULL,
`created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
`id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`total_jobs` int NOT NULL,
`pending_jobs` int NOT NULL,
`failed_jobs` int NOT NULL,
`failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
`options` mediumtext COLLATE utf8mb4_unicode_ci,
`cancelled_at` int DEFAULT NULL,
`created_at` int NOT NULL,
`finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `kampus`
--

CREATE TABLE `kampus` (
`id` bigint UNSIGNED NOT NULL,
`kode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
`nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
`alamat` text COLLATE utf8mb4_unicode_ci,
`is_aktif` tinyint(1) NOT NULL DEFAULT '1',
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kampus`
--

INSERT INTO `kampus` (`id`, `kode`, `nama`, `alamat`, `is_aktif`, `created_at`, `updated_at`) VALUES
(1, 'B', 'Kampus B', 'Alamat Kampus B', 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(2, 'C', 'Kampus C', 'Alamat Kampus C', 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19');

---

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
`id` bigint UNSIGNED NOT NULL,
`program_studi_id` bigint UNSIGNED NOT NULL,
`kampus_id` bigint UNSIGNED NOT NULL,
`tingkat_semester` tinyint UNSIGNED NOT NULL,
`kode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
`nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
`tahun_ajaran_id` bigint UNSIGNED NOT NULL,
`kapasitas` smallint UNSIGNED NOT NULL DEFAULT '30',
`is_aktif` tinyint(1) NOT NULL DEFAULT '1',
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `kelas_mata_kuliah`
--

CREATE TABLE `kelas_mata_kuliah` (
`id` bigint UNSIGNED NOT NULL,
`kelas_id` bigint UNSIGNED NOT NULL,
`mata_kuliah_id` bigint UNSIGNED NOT NULL,
`semester_id` bigint UNSIGNED NOT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `laboratorium`
--

CREATE TABLE `laboratorium` (
`id` bigint UNSIGNED NOT NULL,
`kampus_id` bigint UNSIGNED NOT NULL,
`kode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
`nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
`kapasitas` smallint UNSIGNED NOT NULL DEFAULT '30',
`deskripsi` text COLLATE utf8mb4_unicode_ci,
`is_aktif` tinyint(1) NOT NULL DEFAULT '1',
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
`id` bigint UNSIGNED NOT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `mata_kuliah`
--

CREATE TABLE `mata_kuliah` (
`id` bigint UNSIGNED NOT NULL,
`program_studi_id` bigint UNSIGNED NOT NULL,
`kode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
`nama` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
`sks` tinyint UNSIGNED NOT NULL,
`tingkat_semester` tinyint UNSIGNED NOT NULL,
`tipe_semester` enum('ganjil','genap','both') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'both',
`butuh_lab` tinyint(1) NOT NULL DEFAULT '1',
`deskripsi` text COLLATE utf8mb4_unicode_ci,
`is_aktif` tinyint(1) NOT NULL DEFAULT '1',
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
`id` int UNSIGNED NOT NULL,
`migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_26_100418_add_two_factor_columns_to_users_table', 1),
(5, '2025_11_10_042137_create_tahun_ajaran_table', 1),
(6, '2025_11_10_042143_create_semester_table', 1),
(7, '2025_11_10_042144_create_kampus_table', 1),
(8, '2025_11_10_042145_create_laboratorium_table', 1),
(9, '2025_11_10_042146_create_program_studi_table', 1),
(10, '2025_11_10_042147_create_kelas_table', 1),
(11, '2025_11_10_042148_create_mata_kuliah_table', 1),
(12, '2025_11_10_042149_create_kelas_mata_kuliah_table', 1),
(13, '2025_11_10_042150_create_slot_waktu_table', 1),
(14, '2025_11_10_042151_create_dosen_table', 1),
(15, '2025_11_10_042152_create_jadwal_master_table', 1),
(16, '2025_11_10_042153_create_sesi_jadwal_table', 1),
(17, '2025_11_10_042154_add_peran_to_users_table', 1),
(18, '2025_11_10_154000_create_tukar_jadwal_table', 1),
(19, '2025_11_10_154100_create_booking_laboratorium_table', 1),
(20, '2025_11_11_005005_alter_sesi_jadwal_add_tidak_masuk_status', 1),
(21, '2025_11_11_215418_add_kelas_mata_kuliah_to_booking_laboratorium_table', 1),
(22, '2025_11_11_220039_add_jenis_to_tukar_jadwal_table', 1),
(23, '2025_11_12_150452_add_foto_profil_to_users_table', 1),
(24, '2025_11_12_174146_create_log_aktivitas_table', 1),
(25, '2025_11_12_174147_create_tukar_jadwal_request_table', 1);

---

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
`email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `program_studi`
--

CREATE TABLE `program_studi` (
`id` bigint UNSIGNED NOT NULL,
`kode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
`nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
`deskripsi` text COLLATE utf8mb4_unicode_ci,
`is_aktif` tinyint(1) NOT NULL DEFAULT '1',
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `semester`
--

CREATE TABLE `semester` (
`id` bigint UNSIGNED NOT NULL,
`tahun_ajaran_id` bigint UNSIGNED NOT NULL,
`nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
`tipe` enum('ganjil','genap') COLLATE utf8mb4_unicode_ci NOT NULL,
`tanggal_mulai` date NOT NULL,
`tanggal_selesai` date NOT NULL,
`total_minggu` tinyint UNSIGNED DEFAULT NULL,
`is_aktif` tinyint(1) NOT NULL DEFAULT '0',
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `sesi_jadwal`
--

CREATE TABLE `sesi_jadwal` (
`id` bigint UNSIGNED NOT NULL,
`jadwal_master_id` bigint UNSIGNED NOT NULL,
`pertemuan_ke` tinyint UNSIGNED NOT NULL,
`tanggal` date NOT NULL,
`status` enum('terjadwal','berlangsung','selesai','tidak_masuk','dibatalkan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'terjadwal',
`catatan` text COLLATE utf8mb4_unicode_ci,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
`id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`user_id` bigint UNSIGNED DEFAULT NULL,
`ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`user_agent` text COLLATE utf8mb4_unicode_ci,
`payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
`last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `slot_waktu`
--

CREATE TABLE `slot_waktu` (
`id` bigint UNSIGNED NOT NULL,
`waktu_mulai` time NOT NULL,
`waktu_selesai` time NOT NULL,
`label` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
`urutan` tinyint UNSIGNED NOT NULL,
`is_aktif` tinyint(1) NOT NULL DEFAULT '1',
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `slot_waktu`
--

INSERT INTO `slot_waktu` (`id`, `waktu_mulai`, `waktu_selesai`, `label`, `urutan`, `is_aktif`, `created_at`, `updated_at`) VALUES
(1, '08:00:00', '08:45:00', 'Slot 1 (08:00-08:45)', 1, 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(2, '08:45:00', '09:30:00', 'Slot 2 (08:45-09:30)', 2, 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(3, '09:30:00', '10:15:00', 'Slot 3 (09:30-10:15)', 3, 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(4, '10:15:00', '11:00:00', 'Slot 4 (10:15-11:00)', 4, 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(5, '11:00:00', '11:45:00', 'Slot 5 (11:00-11:45)', 5, 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(6, '11:45:00', '13:15:00', 'Istirahat (11:45-13:15)', 6, 0, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(7, '13:15:00', '14:00:00', 'Slot 6 (13:15-14:00)', 7, 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(8, '14:00:00', '14:45:00', 'Slot 7 (14:00-14:45)', 8, 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(9, '14:45:00', '15:30:00', 'Slot 8 (14:45-15:30)', 9, 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19'),
(10, '15:30:00', '16:15:00', 'Slot 9 (15:30-16:15)', 10, 1, '2025-11-13 01:26:19', '2025-11-13 01:26:19');

---

--
-- Table structure for table `tahun_ajaran`
--

CREATE TABLE `tahun_ajaran` (
`id` bigint UNSIGNED NOT NULL,
`nama` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
`tanggal_mulai` date NOT NULL,
`tanggal_selesai` date NOT NULL,
`is_aktif` tinyint(1) NOT NULL DEFAULT '0',
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `tukar_jadwal`
--

CREATE TABLE `tukar_jadwal` (
`id` bigint UNSIGNED NOT NULL,
`pemohon_id` bigint UNSIGNED NOT NULL,
`sesi_jadwal_pemohon_id` bigint UNSIGNED NOT NULL,
`mitra_id` bigint UNSIGNED DEFAULT NULL,
`sesi_jadwal_mitra_id` bigint UNSIGNED DEFAULT NULL,
`status` enum('menunggu','disetujui','ditolak','dibatalkan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
`alasan_pemohon` text COLLATE utf8mb4_unicode_ci,
`jenis` enum('tukar','pindah') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tukar',
`alasan_penolakan` text COLLATE utf8mb4_unicode_ci,
`tanggal_diajukan` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
`tanggal_diproses` timestamp NULL DEFAULT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `tukar_jadwal_request`
--

CREATE TABLE `tukar_jadwal_request` (
`id` bigint UNSIGNED NOT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
`id` bigint UNSIGNED NOT NULL,
`name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`foto_profil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`peran` enum('super_admin','admin','dosen') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dosen',
`email_verified_at` timestamp NULL DEFAULT NULL,
`password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`two_factor_secret` text COLLATE utf8mb4_unicode_ci,
`two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
`two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
`remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `foto_profil`, `peran`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'admin@unuha.ac.id', NULL, 'super_admin', '2025-11-13 01:26:19', '$2y$12$VGFMs3O3FuYpRjBreo0/Iu3wFL.w2KTp76UbdFYLxGTzVPTNNYkUu', NULL, NULL, NULL, NULL, '2025-11-13 01:26:19', '2025-11-13 01:26:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking_laboratorium`
--
ALTER TABLE `booking_laboratorium`
ADD PRIMARY KEY (`id`),
ADD KEY `booking_laboratorium_slot_waktu_mulai_id_foreign` (`slot_waktu_mulai_id`),
ADD KEY `booking_laboratorium_slot_waktu_selesai_id_foreign` (`slot_waktu_selesai_id`),
ADD KEY `booking_laboratorium_diproses_oleh_foreign` (`diproses_oleh`),
ADD KEY `booking_laboratorium_dosen_id_status_index` (`dosen_id`,`status`),
ADD KEY `booking_laboratorium_laboratorium_id_tanggal_index` (`laboratorium_id`,`tanggal`),
ADD KEY `booking_laboratorium_tanggal_status_index` (`tanggal`,`status`),
ADD KEY `booking_laboratorium_kelas_mata_kuliah_id_foreign` (`kelas_mata_kuliah_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
ADD PRIMARY KEY (`key`);

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `dosen_nidn_unique` (`nidn`),
ADD UNIQUE KEY `dosen_nip_unique` (`nip`),
ADD KEY `dosen_program_studi_id_foreign` (`program_studi_id`),
ADD KEY `dosen_kampus_utama_id_foreign` (`kampus_utama_id`),
ADD KEY `dosen_user_id_index` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jadwal_master`
--
ALTER TABLE `jadwal_master`
ADD PRIMARY KEY (`id`),
ADD KEY `jadwal_master_kelas_mata_kuliah_id_foreign` (`kelas_mata_kuliah_id`),
ADD KEY `jadwal_master_slot_waktu_mulai_id_foreign` (`slot_waktu_mulai_id`),
ADD KEY `jadwal_master_slot_waktu_selesai_id_foreign` (`slot_waktu_selesai_id`),
ADD KEY `jadwal_master_hari_slot_waktu_mulai_id_index` (`hari`,`slot_waktu_mulai_id`),
ADD KEY `jadwal_master_laboratorium_id_index` (`laboratorium_id`),
ADD KEY `jadwal_master_dosen_id_index` (`dosen_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
ADD PRIMARY KEY (`id`),
ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kampus`
--
ALTER TABLE `kampus`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `kampus_kode_unique` (`kode`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `kelas_program_studi_id_kampus_id_kode_tahun_ajaran_id_unique` (`program_studi_id`,`kampus_id`,`kode`,`tahun_ajaran_id`),
ADD KEY `kelas_tahun_ajaran_id_foreign` (`tahun_ajaran_id`),
ADD KEY `kelas_kampus_id_index` (`kampus_id`),
ADD KEY `kelas_tingkat_semester_index` (`tingkat_semester`);

--
-- Indexes for table `kelas_mata_kuliah`
--
ALTER TABLE `kelas_mata_kuliah`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `kelas_mata_kuliah_kelas_id_mata_kuliah_id_semester_id_unique` (`kelas_id`,`mata_kuliah_id`,`semester_id`),
ADD KEY `kelas_mata_kuliah_mata_kuliah_id_foreign` (`mata_kuliah_id`),
ADD KEY `kelas_mata_kuliah_semester_id_foreign` (`semester_id`);

--
-- Indexes for table `laboratorium`
--
ALTER TABLE `laboratorium`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `laboratorium_kampus_id_kode_unique` (`kampus_id`,`kode`),
ADD KEY `laboratorium_kampus_id_is_aktif_index` (`kampus_id`,`is_aktif`);

--
-- Indexes for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `mata_kuliah_program_studi_id_kode_unique` (`program_studi_id`,`kode`),
ADD KEY `mata_kuliah_tingkat_semester_tipe_semester_index` (`tingkat_semester`,`tipe_semester`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
ADD PRIMARY KEY (`email`);

--
-- Indexes for table `program_studi`
--
ALTER TABLE `program_studi`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `program_studi_kode_unique` (`kode`);

--
-- Indexes for table `semester`
--
ALTER TABLE `semester`
ADD PRIMARY KEY (`id`),
ADD KEY `semester_tahun_ajaran_id_foreign` (`tahun_ajaran_id`),
ADD KEY `semester_is_aktif_index` (`is_aktif`),
ADD KEY `semester_tipe_index` (`tipe`);

--
-- Indexes for table `sesi_jadwal`
--
ALTER TABLE `sesi_jadwal`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `sesi_jadwal_jadwal_master_id_pertemuan_ke_unique` (`jadwal_master_id`,`pertemuan_ke`),
ADD KEY `sesi_jadwal_tanggal_index` (`tanggal`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
ADD PRIMARY KEY (`id`),
ADD KEY `sessions_user_id_index` (`user_id`),
ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `slot_waktu`
--
ALTER TABLE `slot_waktu`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `slot_waktu_waktu_mulai_waktu_selesai_unique` (`waktu_mulai`,`waktu_selesai`),
ADD KEY `slot_waktu_urutan_index` (`urutan`);

--
-- Indexes for table `tahun_ajaran`
--
ALTER TABLE `tahun_ajaran`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `tahun_ajaran_nama_unique` (`nama`),
ADD KEY `tahun_ajaran_is_aktif_index` (`is_aktif`);

--
-- Indexes for table `tukar_jadwal`
--
ALTER TABLE `tukar_jadwal`
ADD PRIMARY KEY (`id`),
ADD KEY `tukar_jadwal_sesi_jadwal_pemohon_id_foreign` (`sesi_jadwal_pemohon_id`),
ADD KEY `tukar_jadwal_sesi_jadwal_mitra_id_foreign` (`sesi_jadwal_mitra_id`),
ADD KEY `tukar_jadwal_pemohon_id_status_index` (`pemohon_id`,`status`),
ADD KEY `tukar_jadwal_mitra_id_status_index` (`mitra_id`,`status`);

--
-- Indexes for table `tukar_jadwal_request`
--
ALTER TABLE `tukar_jadwal_request`
ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking_laboratorium`
--
ALTER TABLE `booking_laboratorium`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dosen`
--
ALTER TABLE `dosen`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jadwal_master`
--
ALTER TABLE `jadwal_master`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kampus`
--
ALTER TABLE `kampus`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kelas_mata_kuliah`
--
ALTER TABLE `kelas_mata_kuliah`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `laboratorium`
--
ALTER TABLE `laboratorium`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `program_studi`
--
ALTER TABLE `program_studi`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `semester`
--
ALTER TABLE `semester`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sesi_jadwal`
--
ALTER TABLE `sesi_jadwal`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `slot_waktu`
--
ALTER TABLE `slot_waktu`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tahun_ajaran`
--
ALTER TABLE `tahun_ajaran`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tukar_jadwal`
--
ALTER TABLE `tukar_jadwal`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tukar_jadwal_request`
--
ALTER TABLE `tukar_jadwal_request`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking_laboratorium`
--
ALTER TABLE `booking_laboratorium`
ADD CONSTRAINT `booking_laboratorium_diproses_oleh_foreign` FOREIGN KEY (`diproses_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `booking_laboratorium_dosen_id_foreign` FOREIGN KEY (`dosen_id`) REFERENCES `dosen` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `booking_laboratorium_kelas_mata_kuliah_id_foreign` FOREIGN KEY (`kelas_mata_kuliah_id`) REFERENCES `kelas_mata_kuliah` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `booking_laboratorium_laboratorium_id_foreign` FOREIGN KEY (`laboratorium_id`) REFERENCES `laboratorium` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `booking_laboratorium_slot_waktu_mulai_id_foreign` FOREIGN KEY (`slot_waktu_mulai_id`) REFERENCES `slot_waktu` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `booking_laboratorium_slot_waktu_selesai_id_foreign` FOREIGN KEY (`slot_waktu_selesai_id`) REFERENCES `slot_waktu` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dosen`
--
ALTER TABLE `dosen`
ADD CONSTRAINT `dosen_kampus_utama_id_foreign` FOREIGN KEY (`kampus_utama_id`) REFERENCES `kampus` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `dosen_program_studi_id_foreign` FOREIGN KEY (`program_studi_id`) REFERENCES `program_studi` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `dosen_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jadwal_master`
--
ALTER TABLE `jadwal_master`
ADD CONSTRAINT `jadwal_master_dosen_id_foreign` FOREIGN KEY (`dosen_id`) REFERENCES `dosen` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `jadwal_master_kelas_mata_kuliah_id_foreign` FOREIGN KEY (`kelas_mata_kuliah_id`) REFERENCES `kelas_mata_kuliah` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `jadwal_master_laboratorium_id_foreign` FOREIGN KEY (`laboratorium_id`) REFERENCES `laboratorium` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `jadwal_master_slot_waktu_mulai_id_foreign` FOREIGN KEY (`slot_waktu_mulai_id`) REFERENCES `slot_waktu` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `jadwal_master_slot_waktu_selesai_id_foreign` FOREIGN KEY (`slot_waktu_selesai_id`) REFERENCES `slot_waktu` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kelas`
--
ALTER TABLE `kelas`
ADD CONSTRAINT `kelas_kampus_id_foreign` FOREIGN KEY (`kampus_id`) REFERENCES `kampus` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `kelas_program_studi_id_foreign` FOREIGN KEY (`program_studi_id`) REFERENCES `program_studi` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `kelas_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kelas_mata_kuliah`
--
ALTER TABLE `kelas_mata_kuliah`
ADD CONSTRAINT `kelas_mata_kuliah_kelas_id_foreign` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `kelas_mata_kuliah_mata_kuliah_id_foreign` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `kelas_mata_kuliah_semester_id_foreign` FOREIGN KEY (`semester_id`) REFERENCES `semester` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `laboratorium`
--
ALTER TABLE `laboratorium`
ADD CONSTRAINT `laboratorium_kampus_id_foreign` FOREIGN KEY (`kampus_id`) REFERENCES `kampus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
ADD CONSTRAINT `mata_kuliah_program_studi_id_foreign` FOREIGN KEY (`program_studi_id`) REFERENCES `program_studi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `semester`
--
ALTER TABLE `semester`
ADD CONSTRAINT `semester_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sesi_jadwal`
--
ALTER TABLE `sesi_jadwal`
ADD CONSTRAINT `sesi_jadwal_jadwal_master_id_foreign` FOREIGN KEY (`jadwal_master_id`) REFERENCES `jadwal_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tukar_jadwal`
--
ALTER TABLE `tukar_jadwal`
ADD CONSTRAINT `tukar_jadwal_mitra_id_foreign` FOREIGN KEY (`mitra_id`) REFERENCES `dosen` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `tukar_jadwal_pemohon_id_foreign` FOREIGN KEY (`pemohon_id`) REFERENCES `dosen` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `tukar_jadwal_sesi_jadwal_mitra_id_foreign` FOREIGN KEY (`sesi_jadwal_mitra_id`) REFERENCES `sesi_jadwal` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `tukar_jadwal_sesi_jadwal_pemohon_id_foreign` FOREIGN KEY (`sesi_jadwal_pemohon_id`) REFERENCES `sesi_jadwal` (`id`) ON DELETE CASCADE;
COMMIT;

/_!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT _/;
/_!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS _/;
/_!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION _/;
