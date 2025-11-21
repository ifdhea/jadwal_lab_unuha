-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 21, 2025 at 07:21 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jadwal_lab`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `actor_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'blue',
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `activity_date` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `actor_name`, `actor_role`, `action`, `title`, `description`, `data`, `icon`, `color`, `is_public`, `activity_date`, `created_at`, `updated_at`) VALUES
(6, 19, 'Nirma', 'Dosen', 'booking_lab', 'Booking Lab Disetujui', 'Nirma booking LAB C PTI pada 19 Nov 2025 pukul 08:00:00 - 10:15:00 untuk Remedial', '{\"dosen\":\"Nirma\",\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"19 Nov 2025\",\"waktu\":\"08:00:00 - 10:15:00\",\"keperluan\":\"Remedial\"}', '✅', 'green', 1, '2025-11-18 17:00:00', '2025-11-17 09:12:01', '2025-11-17 09:12:01'),
(7, 19, 'Nirma', 'Dosen', 'booking_lab', 'Booking Lab Disetujui', 'Nirma booking LAB C PTI pada 06 Dec 2025 pukul 08:00:00 - 10:15:00 untuk Praktikum', '{\"dosen\":\"Nirma\",\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"06 Dec 2025\",\"waktu\":\"08:00:00 - 10:15:00\",\"keperluan\":\"Praktikum\"}', '✅', 'green', 1, '2025-12-05 17:00:00', '2025-11-18 04:12:20', '2025-11-18 04:12:20'),
(8, 19, 'Nirma', 'Dosen', 'booking_lab', 'Booking Lab Disetujui', 'Nirma booking LAB C PTI pada 03 Dec 2025 pukul 08:00:00 - 10:15:00 untuk Praktikum', '{\"dosen\":\"Nirma\",\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"03 Dec 2025\",\"waktu\":\"08:00:00 - 10:15:00\",\"keperluan\":\"Praktikum\"}', '✅', 'green', 1, '2025-12-02 17:00:00', '2025-11-18 04:12:21', '2025-11-18 04:12:21'),
(9, 19, 'Nirma', 'Dosen', 'tukar_jadwal', 'Tukar Jadwal', 'Nirma menukar jadwal Sistem Basis Data di Lab A Kom Dasar dengan Wardianto untuk jadwal Pengantar Ilmu Komputer di Lab A Kom Dasar', '{\"pemohon\":\"Nirma\",\"mitra\":\"Wardianto\",\"mk_pemohon\":\"Sistem Basis Data\",\"mk_mitra\":\"Pengantar Ilmu Komputer\",\"lab_pemohon\":\"Lab A Kom Dasar\",\"lab_mitra\":\"Lab A Kom Dasar\",\"tanggal_pemohon\":\"11 Dec 2025\",\"tanggal_mitra\":\"08 Dec 2025\"}', '🔄', 'blue', 1, '2025-12-10 17:00:00', '2025-11-18 04:15:15', '2025-11-18 04:15:15'),
(10, 18, 'Wardianto', 'Dosen', 'booking_lab', 'Booking Lab Disetujui', 'Wardianto booking LAB C PTI pada 18 Nov 2025 pukul 13:15:00 - 15:30:00 untuk Rapat', '{\"dosen\":\"Wardianto\",\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"18 Nov 2025\",\"waktu\":\"13:15:00 - 15:30:00\",\"keperluan\":\"Rapat\"}', '✅', 'green', 1, '2025-11-17 17:00:00', '2025-11-18 04:22:48', '2025-11-18 04:22:48'),
(11, 19, 'Nirma', 'Dosen', 'booking_lab', 'Booking Lab Disetujui', 'Nirma booking Lab A Kom Dasar pada 18 Nov 2025 pukul 08:00:00 - 10:15:00 untuk Praktikum', '{\"dosen\":\"Nirma\",\"laboratorium\":\"Lab A Kom Dasar\",\"tanggal\":\"18 Nov 2025\",\"waktu\":\"08:00:00 - 10:15:00\",\"keperluan\":\"Praktikum\"}', '✅', 'green', 1, '2025-11-17 17:00:00', '2025-11-18 05:08:28', '2025-11-18 05:08:28');

-- --------------------------------------------------------

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

--
-- Dumping data for table `booking_laboratorium`
--

INSERT INTO `booking_laboratorium` (`id`, `dosen_id`, `kelas_mata_kuliah_id`, `laboratorium_id`, `tanggal`, `slot_waktu_mulai_id`, `slot_waktu_selesai_id`, `durasi_slot`, `keperluan`, `keterangan`, `status`, `catatan_admin`, `diproses_oleh`, `tanggal_diajukan`, `tanggal_diproses`, `created_at`, `updated_at`) VALUES
(4, 13, 4, 4, '2025-11-18', 1, 3, 3, 'Praktikum', NULL, 'disetujui', NULL, 1, '2025-11-18 05:07:25', '2025-11-18 05:08:28', '2025-11-18 05:07:25', '2025-11-18 05:08:28'),
(5, 16, 5, 4, '2025-11-22', 1, 3, 3, 'Praktikum', NULL, 'menunggu', NULL, NULL, '2025-11-19 09:19:21', NULL, '2025-11-19 09:19:21', '2025-11-19 09:19:21'),
(6, 16, 5, 2, '2025-11-25', 1, 3, 3, 'Praktikum', NULL, 'menunggu', NULL, NULL, '2025-11-19 09:19:47', NULL, '2025-11-19 09:19:47', '2025-11-19 09:19:47');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('jadwal-lab-cache-026dedb84c752d2e0b284b8de7312d96', 'i:1;', 1763543993),
('jadwal-lab-cache-026dedb84c752d2e0b284b8de7312d96:timer', 'i:1763543993;', 1763543993),
('jadwal-lab-cache-3053762927f674cea5f37fa7cf68e181', 'i:1;', 1763442634),
('jadwal-lab-cache-3053762927f674cea5f37fa7cf68e181:timer', 'i:1763442634;', 1763442634),
('jadwal-lab-cache-31a24322c3c3f56c5694794860f231ad', 'i:1;', 1763442552),
('jadwal-lab-cache-31a24322c3c3f56c5694794860f231ad:timer', 'i:1763442552;', 1763442552),
('jadwal-lab-cache-71cdcdcafdac38cef7b08f4a5ba4e084', 'i:1;', 1763439185),
('jadwal-lab-cache-71cdcdcafdac38cef7b08f4a5ba4e084:timer', 'i:1763439185;', 1763439185),
('jadwal-lab-cache-admin@lab.ac.id|127.0.0.1', 'i:1;', 1763439185),
('jadwal-lab-cache-admin@lab.ac.id|127.0.0.1:timer', 'i:1763439185;', 1763439185),
('jadwal-lab-cache-bbada0e9a6c66a2e9c0ba73cc63230e1', 'i:1;', 1763440092),
('jadwal-lab-cache-bbada0e9a6c66a2e9c0ba73cc63230e1:timer', 'i:1763440092;', 1763440092),
('jadwal-lab-cache-e5599e2b49a132d7e09a61035311b2c6', 'i:1;', 1763439364),
('jadwal-lab-cache-e5599e2b49a132d7e09a61035311b2c6:timer', 'i:1763439364;', 1763439364);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

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

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`id`, `user_id`, `nidn`, `nip`, `program_studi_id`, `kampus_utama_id`, `gelar_depan`, `gelar_belakang`, `no_telp`, `alamat`, `is_aktif`, `created_at`, `updated_at`) VALUES
(12, 18, '0210109501', '199510102023101580', 1, NULL, NULL, 'M.Kom', '085789955576', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(13, 19, '0227069702', '19961106202410.2.617', 1, NULL, 'Dr.', 'S.kom., M.T.I', '082377687325', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(14, 20, '0202119001', '199011022019071324', 2, NULL, NULL, 'M.Kom', '082386987273', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(15, 21, '0208108502', '198510082012071175', 2, NULL, NULL, 'M.Kom', '082330526073', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(16, 22, '0209119302', '199410092021071411', 2, NULL, NULL, 'M.Kom', '085647973369', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(17, 23, '0208088601', '198608082011071155', 2, NULL, NULL, 'M.Kom', '082180742823', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(18, 24, '0214049302', '199304142022112508', 2, NULL, NULL, 'M.Kom', '082375847540', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(19, 25, '0219049801', '199804192024062596', 2, NULL, NULL, 'M.Kom', '085879214717', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(20, 26, '9999999999', '198002162000071041', 2, NULL, NULL, 'S.Pd.I.,M.Pd.I', '081271294699', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(21, 27, '8875610016', '196806281998071038', 2, NULL, NULL, 'M.Pd.I', '085367259334', NULL, 1, '2025-11-17 04:08:07', '2025-11-17 04:08:07');

-- --------------------------------------------------------

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

-- --------------------------------------------------------

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

--
-- Dumping data for table `jadwal_master`
--

INSERT INTO `jadwal_master` (`id`, `kelas_mata_kuliah_id`, `dosen_id`, `laboratorium_id`, `hari`, `slot_waktu_mulai_id`, `slot_waktu_selesai_id`, `durasi_slot`, `status_konflik`, `pola_minggu`, `created_at`, `updated_at`) VALUES
(1, 2, 12, 2, 'Senin', 1, 2, 2, 'bebas', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(2, 4, 13, 4, 'Senin', 3, 4, 2, 'bebas', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(3, 44, 18, 1, 'Selasa', 1, 3, 3, 'bebas', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(4, 45, 19, 3, 'Selasa', 4, 6, 3, 'bebas', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(5, 5, 16, 2, 'Rabu', 7, 10, 4, 'bebas', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(6, 40, 14, 1, 'Kamis', 1, 2, 2, 'bebas', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(7, 49, 21, 3, 'Kamis', 3, 6, 4, 'bebas', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(8, 8, 12, 2, 'Jumat', 1, 3, 3, 'konflik', '1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(9, 9, 17, 2, 'Jumat', 1, 3, 3, 'konflik', '0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(10, 48, 20, 1, 'Senin', 8, 9, 2, 'konflik', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(11, 49, 21, 1, 'Senin', 7, 10, 4, 'konflik', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(12, 26, 12, 4, 'Kamis', 1, 2, 2, 'konflik', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41'),
(13, 8, 13, 4, 'Kamis', 2, 4, 3, 'konflik', '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', '2025-11-17 09:17:26', '2025-11-17 09:17:41');

-- --------------------------------------------------------

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

-- --------------------------------------------------------

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

-- --------------------------------------------------------

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
(1, 'B', 'Kampus B', 'Alamat Kampus B', 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(2, 'C', 'Kampus C', 'Alamat Kampus C', 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46');

-- --------------------------------------------------------

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

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id`, `program_studi_id`, `kampus_id`, `tingkat_semester`, `kode`, `nama`, `tahun_ajaran_id`, `kapasitas`, `is_aktif`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 1, 'INF C01  - S1', 'INF C01 - Semester 1', 1, 30, 1, '2025-11-16 17:11:09', '2025-11-17 10:13:26'),
(2, 1, 2, 1, 'INF C02 - S1', 'INF C02 - Semester 1', 1, 30, 1, '2025-11-17 10:05:11', '2025-11-17 10:11:59'),
(3, 1, 2, 3, 'INF C03 - S3', 'INF C03 - Semester 1', 1, 30, 1, '2025-11-17 10:08:11', '2025-11-17 10:14:23'),
(5, 1, 2, 5, 'INF-C05', 'INF C01 - Semester 5', 1, 30, 1, '2025-11-17 10:09:02', '2025-11-17 10:13:03'),
(6, 1, 2, 3, 'INF C02 - S3', 'INF C02 - Semester 3', 1, 30, 1, '2025-11-17 10:09:06', '2025-11-17 10:12:17'),
(10, 1, 2, 5, 'INF C02', 'INF C02 - Semester 5', 1, 30, 1, '2025-11-17 10:14:03', '2025-11-17 10:14:38'),
(11, 1, 2, 3, 'INF C01 - S3', 'INF C01 - Semester 3', 1, 30, 1, '2025-11-17 10:15:30', '2025-11-17 10:15:30'),
(12, 2, 2, 1, 'PTI C01 - S1', 'PTI C01 - Semester 1', 1, 30, 1, '2025-11-17 10:16:51', '2025-11-17 10:16:51'),
(13, 2, 2, 3, 'PTI C01 - S3', 'PTI C01 - Semester 3', 1, 30, 1, '2025-11-17 10:17:05', '2025-11-17 10:17:05'),
(14, 2, 2, 5, 'PTI C01-S5', 'PTI C01 -  Semester 5', 1, 30, 1, '2025-11-17 10:17:07', '2025-11-17 10:24:21'),
(15, 2, 2, 1, 'PTI C02 - S1', 'PTI C02 - Semester 1', 1, 30, 1, '2025-11-17 10:17:32', '2025-11-17 10:17:32'),
(16, 2, 2, 5, 'PTI C02 - S5', 'PTI C02 - Semester 5', 1, 30, 1, '2025-11-17 10:17:59', '2025-11-17 10:23:50'),
(17, 2, 2, 3, 'PTI C02 - S3', 'PTI C02 - Semester 3', 1, 30, 1, '2025-11-17 10:18:04', '2025-11-17 10:18:04'),
(18, 1, 1, 1, 'INF B01 - S1', 'INF B01 - Semester 1', 1, 30, 1, '2025-11-17 10:19:50', '2025-11-17 10:19:50'),
(19, 1, 1, 3, 'INF B01 - S3', 'INF B01 - Semester 3', 1, 30, 1, '2025-11-17 10:19:54', '2025-11-17 10:19:54'),
(20, 2, 1, 1, 'PTI B01 - S1', 'PTI B01 - Semester 1', 1, 30, 1, '2025-11-17 10:20:32', '2025-11-17 10:20:32'),
(21, 2, 1, 3, 'PTI B01 - S3', 'PTI B01 - Semester 3', 1, 30, 1, '2025-11-17 10:20:49', '2025-11-17 10:20:49'),
(22, 1, 1, 5, 'INF B01-S1', 'INF B01 - Semester 5', 1, 30, 1, '2025-11-17 10:20:51', '2025-11-17 10:28:22'),
(23, 1, 1, 5, 'INF B02-S1', 'INF B02 - Semester 5', 1, 30, 1, '2025-11-17 10:22:44', '2025-11-17 10:28:48'),
(24, 1, 1, 1, 'INF B02 - S1', 'INF B02  - Semester 1', 1, 30, 1, '2025-11-17 10:25:51', '2025-11-17 10:25:51'),
(25, 2, 1, 5, 'PTI B01-S5', 'PTI B01 - Semester 5', 1, 30, 1, '2025-11-17 10:31:21', '2025-11-17 10:31:45');

-- --------------------------------------------------------

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

--
-- Dumping data for table `kelas_mata_kuliah`
--

INSERT INTO `kelas_mata_kuliah` (`id`, `kelas_id`, `mata_kuliah_id`, `semester_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, '2025-11-16 17:13:08', '2025-11-16 17:13:08'),
(2, 18, 2, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(3, 18, 3, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(4, 18, 4, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(5, 24, 2, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(6, 24, 3, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(7, 24, 4, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(8, 19, 5, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(9, 19, 6, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(10, 19, 7, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(11, 19, 8, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(12, 22, 9, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(13, 22, 10, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(14, 23, 9, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(15, 23, 11, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(16, 20, 13, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(17, 20, 14, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(18, 20, 15, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(19, 21, 16, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(20, 21, 17, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(21, 21, 18, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(22, 21, 19, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(23, 25, 20, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(24, 25, 21, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(25, 25, 22, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(26, 1, 2, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(27, 1, 3, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(28, 2, 2, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(29, 2, 4, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(30, 11, 5, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(31, 11, 6, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(32, 3, 5, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(33, 6, 7, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(34, 6, 8, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(35, 5, 9, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(36, 5, 10, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(37, 10, 9, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(38, 10, 11, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(39, 10, 12, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(40, 12, 13, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(41, 12, 14, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(42, 15, 13, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(43, 15, 15, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(44, 13, 16, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(45, 13, 17, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(46, 17, 16, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(47, 17, 18, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(48, 14, 20, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(49, 14, 21, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(50, 16, 20, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(51, 16, 23, 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47');

-- --------------------------------------------------------

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

--
-- Dumping data for table `laboratorium`
--

INSERT INTO `laboratorium` (`id`, `kampus_id`, `kode`, `nama`, `kapasitas`, `deskripsi`, `is_aktif`, `created_at`, `updated_at`) VALUES
(1, 2, 'LAB C PTI', 'LAB C PTI', 30, 'Laboratorium C PTI sebagai ruang kreativitas digital untuk praktik desain grafis dan multimedia.', 1, '2025-11-16 17:09:06', '2025-11-17 10:06:55'),
(2, 1, 'LAB A INF', 'LAB A INF', 30, 'Laboratorium A Informatika digunakan untuk praktik pemrograman dan pengembangan aplikasi', 1, '2025-11-17 09:58:19', '2025-11-17 10:05:18'),
(3, 2, 'Lab C Perakitan', 'Lab C Perakitan', 30, 'Laboratorium ini digunakan untuk praktik perakitan dan konfigurasi perangkat komputer, dilengkapi dengan 30 unit untuk kegiatan pembelajaran.', 1, '2025-11-17 09:59:16', '2025-11-17 09:59:28'),
(4, 1, 'Lab A Kom Dasar', 'Lab A Kom Dasar', 30, 'Laboratorium untuk praktikum pengenalan komputer, aplikasi perkantoran, dan pembelajaran dasar teknologi informasi.', 1, '2025-11-17 10:03:33', '2025-11-17 10:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

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

--
-- Dumping data for table `mata_kuliah`
--

INSERT INTO `mata_kuliah` (`id`, `program_studi_id`, `kode`, `nama`, `sks`, `tingkat_semester`, `tipe_semester`, `butuh_lab`, `deskripsi`, `is_aktif`, `created_at`, `updated_at`) VALUES
(1, 1, 'INF202', 'Basis Data', 3, 1, 'ganjil', 1, NULL, 1, '2025-11-16 17:12:02', '2025-11-16 17:12:02'),
(2, 1, 'INF101', 'Pengantar Ilmu Komputer', 3, 1, 'both', 1, 'Pengenalan dasar ilmu komputer dan teknologi informasi', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(3, 1, 'INF102', 'Struktur Data', 3, 1, 'both', 1, 'Pembelajaran tentang struktur data dan implementasinya', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(4, 1, 'INF103', 'Sistem Basis Data', 3, 1, 'both', 1, 'Pengenalan database dan SQL', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(5, 1, 'INF301', 'Pemrograman Web', 3, 3, 'both', 1, 'Pengembangan aplikasi berbasis web dasar', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(6, 1, 'INF302', 'Sistem Operasi', 3, 3, 'both', 1, 'Konsep dan praktik sistem operasi', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(7, 1, 'INF303', 'Pengantar Jaringan Komputer', 3, 3, 'both', 1, 'Dasar jaringan komputer dan protokol', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(8, 1, 'INF304', 'Organisasi dan Arsitektur Komputer', 3, 3, 'both', 1, 'Struktur dan organisasi komputer', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(9, 1, 'INF501', 'Kecerdasan Buatan', 3, 5, 'both', 1, 'Pengenalan AI dan machine learning', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(10, 1, 'INF502', 'Program Aplikasi Mobile', 3, 5, 'both', 1, 'Pengembangan aplikasi mobile', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(11, 1, 'INF503', 'Cloud Computing', 3, 5, 'both', 1, 'Teknologi dan implementasi cloud', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(12, 1, 'INF504', 'E-Commerce', 3, 5, 'both', 1, 'Sistem perdagangan elektronik', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(13, 2, 'PTI101', 'Pengantar Ilmu Komputer', 3, 1, 'both', 1, 'Pengenalan komputer untuk pendidikan', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(14, 2, 'PTI102', 'Sistem Basis Data', 3, 1, 'both', 1, 'Database untuk pembelajaran', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(15, 2, 'PTI103', 'Multimedia I', 3, 1, 'both', 1, 'Dasar multimedia dan desain', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(16, 2, 'PTI301', 'Pemrograman Visual', 3, 3, 'both', 1, 'Pengembangan aplikasi dengan GUI', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(17, 2, 'PTI302', 'Multimedia', 3, 3, 'both', 1, 'Pengembangan media pembelajaran interaktif', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(18, 2, 'PTI303', 'Komunikasi Data', 3, 3, 'both', 1, 'Komunikasi data dan jaringan', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(19, 2, 'PTI304', 'Interaksi Manusia dan Komputer', 3, 3, 'both', 1, 'HCI dan user experience', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(20, 2, 'PTI501', 'Pemrograman Web II', 3, 5, 'both', 1, 'Pengembangan web lanjutan', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(21, 2, 'PTI502', 'Analisis Desain Sistem Informasi', 3, 5, 'both', 1, 'Analisis dan desain sistem', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(22, 2, 'PTI503', 'Sistem Penunjang Keputusan', 3, 5, 'both', 1, 'Decision support system', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47'),
(23, 2, 'PTI504', 'Sistem Berkas dan Keamanan Data', 3, 5, 'both', 1, 'Keamanan informasi dan sistem', 1, '2025-11-17 04:43:47', '2025-11-17 04:43:47');

-- --------------------------------------------------------

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
(25, '2025_11_12_174147_create_tukar_jadwal_request_table', 1),
(26, '2025_11_14_070652_add_override_fields_to_sesi_jadwal_table', 1),
(27, '2025_11_16_173943_create_notifications_table', 1),
(28, '2025_11_16_190950_create_activity_logs_table', 1),
(29, '2025_11_17_141206_add_last_seen_activity_at_to_users_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES
(5, 20, 'tukar_jadwal_request', 'Permintaan Tukar Jadwal', ' meminta tukar jadwal dengan Anda', '{\"tukar_jadwal_id\":1,\"pemohon\":null,\"link\":\"http:\\/\\/jadwal_lab.test\\/tukar-jadwal\\/requests\"}', 0, NULL, '2025-11-17 07:33:30', '2025-11-17 07:33:30'),
(10, 1, 'booking_request', 'Permintaan Booking Lab Baru', ' mengajukan booking lab LAB C PTI', '{\"booking_id\":5,\"dosen\":null,\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"18 Nov 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/admin\\/booking-lab\"}', 1, '2025-11-17 08:13:27', '2025-11-17 08:12:52', '2025-11-17 08:13:27'),
(12, 1, 'booking_request', 'Permintaan Booking Lab Baru', ' mengajukan booking lab LAB C PTI', '{\"booking_id\":6,\"dosen\":null,\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"19 Nov 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/admin\\/booking-lab\"}', 1, '2025-11-17 09:11:57', '2025-11-17 09:11:48', '2025-11-17 09:11:57'),
(14, 1, 'booking_request', 'Permintaan Booking Lab Baru', ' mengajukan booking lab LAB C PTI', '{\"booking_id\":1,\"dosen\":null,\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"03 Dec 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/admin\\/booking-lab\"}', 0, NULL, '2025-11-18 04:04:19', '2025-11-18 04:04:19'),
(15, 1, 'booking_request', 'Permintaan Booking Lab Baru', ' mengajukan booking lab LAB C PTI', '{\"booking_id\":2,\"dosen\":null,\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"06 Dec 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/admin\\/booking-lab\"}', 0, NULL, '2025-11-18 04:11:45', '2025-11-18 04:11:45'),
(16, 19, 'booking_approved', 'Booking Lab Disetujui', 'Booking lab Anda untuk LAB C PTI telah disetujui', '{\"booking_id\":2,\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"06 Dec 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/booking-lab\\/requests\"}', 0, NULL, '2025-11-18 04:12:20', '2025-11-18 04:12:20'),
(17, 19, 'booking_approved', 'Booking Lab Disetujui', 'Booking lab Anda untuk LAB C PTI telah disetujui', '{\"booking_id\":1,\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"03 Dec 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/booking-lab\\/requests\"}', 0, NULL, '2025-11-18 04:12:21', '2025-11-18 04:12:21'),
(18, 18, 'tukar_jadwal_request', 'Permintaan Tukar Jadwal', ' meminta tukar jadwal dengan Anda', '{\"tukar_jadwal_id\":3,\"pemohon\":null,\"link\":\"http:\\/\\/jadwal_lab.test\\/tukar-jadwal\\/requests\"}', 0, NULL, '2025-11-18 04:14:44', '2025-11-18 04:14:44'),
(19, 19, 'tukar_jadwal_approved', 'Tukar Jadwal Disetujui', 'Permintaan tukar jadwal Anda telah disetujui oleh ', '{\"tukar_jadwal_id\":3,\"mitra\":null,\"link\":\"http:\\/\\/jadwal_lab.test\\/tukar-jadwal\\/requests\"}', 0, NULL, '2025-11-18 04:15:15', '2025-11-18 04:15:15'),
(20, 1, 'booking_request', 'Permintaan Booking Lab Baru', ' mengajukan booking lab LAB C PTI', '{\"booking_id\":3,\"dosen\":null,\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"18 Nov 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/admin\\/booking-lab\"}', 0, NULL, '2025-11-18 04:22:14', '2025-11-18 04:22:14'),
(21, 18, 'booking_approved', 'Booking Lab Disetujui', 'Booking lab Anda untuk LAB C PTI telah disetujui', '{\"booking_id\":3,\"laboratorium\":\"LAB C PTI\",\"tanggal\":\"18 Nov 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/booking-lab\\/requests\"}', 0, NULL, '2025-11-18 04:22:48', '2025-11-18 04:22:48'),
(22, 1, 'booking_request', 'Permintaan Booking Lab Baru', ' mengajukan booking lab Lab A Kom Dasar', '{\"booking_id\":4,\"dosen\":null,\"laboratorium\":\"Lab A Kom Dasar\",\"tanggal\":\"18 Nov 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/admin\\/booking-lab\"}', 0, NULL, '2025-11-18 05:07:25', '2025-11-18 05:07:25'),
(23, 19, 'booking_approved', 'Booking Lab Disetujui', 'Booking lab Anda untuk Lab A Kom Dasar telah disetujui', '{\"booking_id\":4,\"laboratorium\":\"Lab A Kom Dasar\",\"tanggal\":\"18 Nov 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/booking-lab\\/requests\"}', 0, NULL, '2025-11-18 05:08:28', '2025-11-18 05:08:28'),
(24, 1, 'booking_request', 'Permintaan Booking Lab Baru', ' mengajukan booking lab Lab A Kom Dasar', '{\"booking_id\":5,\"dosen\":null,\"laboratorium\":\"Lab A Kom Dasar\",\"tanggal\":\"22 Nov 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/admin\\/booking-lab\"}', 0, NULL, '2025-11-19 09:19:21', '2025-11-19 09:19:21'),
(25, 1, 'booking_request', 'Permintaan Booking Lab Baru', ' mengajukan booking lab LAB A INF', '{\"booking_id\":6,\"dosen\":null,\"laboratorium\":\"LAB A INF\",\"tanggal\":\"25 Nov 2025\",\"link\":\"http:\\/\\/jadwal_lab.test\\/admin\\/booking-lab\"}', 0, NULL, '2025-11-19 09:19:47', '2025-11-19 09:19:47');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

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

--
-- Dumping data for table `program_studi`
--

INSERT INTO `program_studi` (`id`, `kode`, `nama`, `deskripsi`, `is_aktif`, `created_at`, `updated_at`) VALUES
(1, 'INF', 'Informatika', NULL, 1, '2025-11-16 17:03:22', '2025-11-16 17:03:22'),
(2, 'PTI', 'Pendidikan Teknologi Informasi', NULL, 1, '2025-11-17 09:50:56', '2025-11-17 09:50:56');

-- --------------------------------------------------------

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

--
-- Dumping data for table `semester`
--

INSERT INTO `semester` (`id`, `tahun_ajaran_id`, `nama`, `tipe`, `tanggal_mulai`, `tanggal_selesai`, `total_minggu`, `is_aktif`, `created_at`, `updated_at`) VALUES
(1, 1, '2025/2026 Ganjil', 'ganjil', '2025-09-22', '2026-01-15', 16, 1, '2025-11-16 17:08:37', '2025-11-16 17:08:37');

-- --------------------------------------------------------

--
-- Table structure for table `sesi_jadwal`
--

CREATE TABLE `sesi_jadwal` (
  `id` bigint UNSIGNED NOT NULL,
  `jadwal_master_id` bigint UNSIGNED NOT NULL,
  `pertemuan_ke` tinyint UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `status` enum('terjadwal','berlangsung','selesai','tidak_masuk','dibatalkan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'terjadwal',
  `override_slot_waktu_mulai_id` bigint UNSIGNED DEFAULT NULL,
  `override_slot_waktu_selesai_id` bigint UNSIGNED DEFAULT NULL,
  `override_laboratorium_id` bigint UNSIGNED DEFAULT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sesi_jadwal`
--

INSERT INTO `sesi_jadwal` (`id`, `jadwal_master_id`, `pertemuan_ke`, `tanggal`, `status`, `override_slot_waktu_mulai_id`, `override_slot_waktu_selesai_id`, `override_laboratorium_id`, `catatan`, `created_at`, `updated_at`) VALUES
(193, 1, 1, '2025-09-22', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(194, 1, 2, '2025-09-29', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(195, 1, 3, '2025-10-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(196, 1, 4, '2025-10-13', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(197, 1, 5, '2025-10-20', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(198, 1, 6, '2025-10-27', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(199, 1, 7, '2025-11-03', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(200, 1, 8, '2025-11-10', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(201, 1, 9, '2025-11-17', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(202, 1, 10, '2025-11-24', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(203, 1, 11, '2025-12-01', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(204, 1, 12, '2025-12-08', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(205, 1, 13, '2025-12-15', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(206, 1, 14, '2025-12-22', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(207, 1, 15, '2025-12-29', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(208, 1, 16, '2026-01-05', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(209, 2, 1, '2025-09-22', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(210, 2, 2, '2025-09-29', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(211, 2, 3, '2025-10-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(212, 2, 4, '2025-10-13', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(213, 2, 5, '2025-10-20', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(214, 2, 6, '2025-10-27', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(215, 2, 7, '2025-11-03', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(216, 2, 8, '2025-11-10', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(217, 2, 9, '2025-11-17', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(218, 2, 10, '2025-11-26', 'terjadwal', 3, 5, 4, NULL, '2025-11-17 14:02:40', '2025-11-18 04:14:23'),
(219, 2, 11, '2025-12-01', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(220, 2, 12, '2025-12-11', 'terjadwal', 1, 3, 4, NULL, '2025-11-17 14:02:40', '2025-11-18 04:15:15'),
(221, 2, 13, '2025-12-15', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(222, 2, 14, '2025-12-22', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(223, 2, 15, '2025-12-29', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(224, 2, 16, '2026-01-05', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(225, 11, 1, '2025-09-22', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(226, 11, 2, '2025-09-29', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(227, 11, 3, '2025-10-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(228, 11, 4, '2025-10-13', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(229, 11, 5, '2025-10-20', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(230, 11, 6, '2025-10-27', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(231, 11, 7, '2025-11-03', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(232, 11, 8, '2025-11-10', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(233, 11, 9, '2025-11-17', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(234, 11, 10, '2025-11-24', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(235, 11, 11, '2025-12-01', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(236, 11, 12, '2025-12-08', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(237, 11, 13, '2025-12-15', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(238, 11, 14, '2025-12-22', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(239, 11, 15, '2025-12-29', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(240, 11, 16, '2026-01-05', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(241, 10, 1, '2025-09-22', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(242, 10, 2, '2025-09-29', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(243, 10, 3, '2025-10-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(244, 10, 4, '2025-10-13', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(245, 10, 5, '2025-10-20', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(246, 10, 6, '2025-10-27', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(247, 10, 7, '2025-11-03', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(248, 10, 8, '2025-11-10', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(249, 10, 9, '2025-11-17', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(250, 10, 10, '2025-11-24', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(251, 10, 11, '2025-12-01', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(252, 10, 12, '2025-12-08', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(253, 10, 13, '2025-12-15', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(254, 10, 14, '2025-12-22', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(255, 10, 15, '2025-12-29', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(256, 10, 16, '2026-01-05', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(257, 3, 1, '2025-09-23', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(258, 3, 2, '2025-09-30', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(259, 3, 3, '2025-10-07', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(260, 3, 4, '2025-10-14', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(261, 3, 5, '2025-10-21', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(262, 3, 6, '2025-10-28', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(263, 3, 7, '2025-11-04', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(264, 3, 8, '2025-11-11', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(265, 3, 9, '2025-11-18', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(266, 3, 10, '2025-11-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(267, 3, 11, '2025-12-02', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(268, 3, 12, '2025-12-09', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(269, 3, 13, '2025-12-16', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(270, 3, 14, '2025-12-23', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(271, 3, 15, '2025-12-30', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(272, 3, 16, '2026-01-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(273, 4, 1, '2025-09-23', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(274, 4, 2, '2025-09-30', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(275, 4, 3, '2025-10-07', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(276, 4, 4, '2025-10-14', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(277, 4, 5, '2025-10-21', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(278, 4, 6, '2025-10-28', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(279, 4, 7, '2025-11-04', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(280, 4, 8, '2025-11-11', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(281, 4, 9, '2025-11-18', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(282, 4, 10, '2025-11-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(283, 4, 11, '2025-12-02', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(284, 4, 12, '2025-12-09', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(285, 4, 13, '2025-12-16', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(286, 4, 14, '2025-12-23', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(287, 4, 15, '2025-12-30', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(288, 4, 16, '2026-01-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(289, 5, 1, '2025-09-24', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(290, 5, 2, '2025-10-01', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(291, 5, 3, '2025-10-08', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(292, 5, 4, '2025-10-15', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(293, 5, 5, '2025-10-22', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(294, 5, 6, '2025-10-29', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(295, 5, 7, '2025-11-05', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(296, 5, 8, '2025-11-12', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(297, 5, 9, '2025-11-19', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(298, 5, 10, '2025-11-26', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(299, 5, 11, '2025-12-03', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(300, 5, 12, '2025-12-10', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(301, 5, 13, '2025-12-17', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(302, 5, 14, '2025-12-24', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(303, 5, 15, '2025-12-31', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(304, 5, 16, '2026-01-07', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(305, 6, 1, '2025-09-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(306, 6, 2, '2025-10-02', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(307, 6, 3, '2025-10-09', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(308, 6, 4, '2025-10-16', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(309, 6, 5, '2025-10-23', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(310, 6, 6, '2025-10-30', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(311, 6, 7, '2025-11-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(312, 6, 8, '2025-11-13', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(313, 6, 9, '2025-11-20', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(314, 6, 10, '2025-11-27', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(315, 6, 11, '2025-12-04', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(316, 6, 12, '2025-12-11', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(317, 6, 13, '2025-12-18', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(318, 6, 14, '2025-12-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(319, 6, 15, '2026-01-01', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(320, 6, 16, '2026-01-08', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(321, 12, 1, '2025-09-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(322, 12, 2, '2025-10-02', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(323, 12, 3, '2025-10-09', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(324, 12, 4, '2025-10-16', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(325, 12, 5, '2025-10-23', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(326, 12, 6, '2025-10-30', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(327, 12, 7, '2025-11-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(328, 12, 8, '2025-11-13', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(329, 12, 9, '2025-11-20', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(330, 12, 10, '2025-11-27', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(331, 12, 11, '2025-12-04', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(332, 12, 12, '2025-12-08', 'terjadwal', 3, 5, 4, NULL, '2025-11-17 14:02:40', '2025-11-18 04:15:15'),
(333, 12, 13, '2025-12-18', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(334, 12, 14, '2025-12-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(335, 12, 15, '2026-01-01', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(336, 12, 16, '2026-01-08', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(337, 13, 1, '2025-09-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(338, 13, 2, '2025-10-02', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(339, 13, 3, '2025-10-09', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(340, 13, 4, '2025-10-16', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(341, 13, 5, '2025-10-23', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(342, 13, 6, '2025-10-30', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(343, 13, 7, '2025-11-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(344, 13, 8, '2025-11-13', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(345, 13, 9, '2025-11-20', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(346, 13, 10, '2025-11-27', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(347, 13, 11, '2025-12-04', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(348, 13, 12, '2025-12-11', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(349, 13, 13, '2025-12-18', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(350, 13, 14, '2025-12-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(351, 13, 15, '2026-01-01', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(352, 13, 16, '2026-01-08', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(353, 7, 1, '2025-09-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(354, 7, 2, '2025-10-02', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(355, 7, 3, '2025-10-09', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(356, 7, 4, '2025-10-16', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(357, 7, 5, '2025-10-23', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(358, 7, 6, '2025-10-30', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(359, 7, 7, '2025-11-06', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(360, 7, 8, '2025-11-13', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(361, 7, 9, '2025-11-21', 'terjadwal', 1, 3, 3, NULL, '2025-11-17 14:02:40', '2025-11-18 05:10:30'),
(362, 7, 10, '2025-11-27', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(363, 7, 11, '2025-12-04', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(364, 7, 12, '2025-12-11', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(365, 7, 13, '2025-12-18', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(366, 7, 14, '2025-12-25', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(367, 7, 15, '2026-01-01', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(368, 7, 16, '2026-01-08', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(369, 8, 1, '2025-09-26', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(370, 9, 2, '2025-10-03', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(371, 8, 3, '2025-10-10', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(372, 9, 4, '2025-10-17', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(373, 8, 5, '2025-10-24', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(374, 9, 6, '2025-10-31', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(375, 8, 7, '2025-11-07', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(376, 9, 8, '2025-11-14', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(377, 8, 9, '2025-11-21', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(378, 9, 10, '2025-11-28', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(379, 8, 11, '2025-12-05', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(380, 9, 12, '2025-12-12', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(381, 8, 13, '2025-12-19', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(382, 9, 14, '2025-12-26', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(383, 8, 15, '2026-01-02', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40'),
(384, 9, 16, '2026-01-09', 'terjadwal', NULL, NULL, NULL, NULL, '2025-11-17 14:02:40', '2025-11-17 14:02:40');

-- --------------------------------------------------------

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

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4RztBP0er1OkC439DnnmngrSieiQU86crcswwnfV', 22, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiUjFSd3VHVDBnbU16c3VkSEV6MXlCR1NhWHI2VlRYNlQ2S3hUYnZ4UyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTY6Imh0dHA6Ly9qYWR3YWxfbGFiLnRlc3QvYXBpL2FjdGl2aXR5LWxvZ3MvY2hlY2stdW5yZWFkP2NsaWVudF9sYXN0X3NlZW49MjAyNS0xMS0xNyUyMDE4JTNBMjclM0E1OCI7czo1OiJyb3V0ZSI7czozMDoiYXBpLmFjdGl2aXR5LWxvZ3MuY2hlY2stdW5yZWFkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MjI7fQ==', 1763551531),
('EwaT9l8Mkz783ppLwnTa3sNGWclyo6ZNfdlg4647', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicG5pcFZBS2M4SlpNNTB5TGtmalBQdHZ5dFNlNnpZdXdjMDY1YVR6QyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9qYWR3YWxfbGFiLnRlc3QiO3M6NToicm91dGUiO3M6NDoiaG9tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1763629671),
('HzgRu8nQgRjWg4qxTcrFMbX6mUPjBtXGkSV2jirD', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Herd/1.22.3 Chrome/120.0.6099.291 Electron/28.2.5 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFZsNXdUa0E2WWRrNGxzdXE0c01LdGZjZ0xKamlDQnkzRDRLdUpSRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly9qYWR3YWxfbGFiLnRlc3QvP2hlcmQ9cHJldmlldyI7czo1OiJyb3V0ZSI7czo0OiJob21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1763521555),
('mtzPaTwmV40TBBPMBel9vi2Pxtn037xEgvbxpav1', NULL, '127.0.0.1', '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2lRdjZDNjBydllIVGN1Z3hqS0JhWHdhcUJiMmxxZDNVNEZwR3RibiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9qYWR3YWxfbGFiLnRlc3QiO3M6NToicm91dGUiO3M6NDoiaG9tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1763703847),
('sUN7wf9w4ecPcqj00CCoIwrJTb7qg8oF7QtS9KZD', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Herd/1.22.3 Chrome/120.0.6099.291 Electron/28.2.5 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMjg1amtlV0tLenYwNmRjQ2xiUHA5U2RkMlp2MmZuZkVHRzFEVEtWZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly9qYWR3YWxfbGFiLnRlc3QvP2hlcmQ9cHJldmlldyI7czo1OiJyb3V0ZSI7czo0OiJob21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1763543921);

-- --------------------------------------------------------

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
(1, '08:00:00', '08:45:00', 'Slot 1 (08:00-08:45)', 1, 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(2, '08:45:00', '09:30:00', 'Slot 2 (08:45-09:30)', 2, 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(3, '09:30:00', '10:15:00', 'Slot 3 (09:30-10:15)', 3, 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(4, '10:15:00', '11:00:00', 'Slot 4 (10:15-11:00)', 4, 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(5, '11:00:00', '11:45:00', 'Slot 5 (11:00-11:45)', 5, 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(6, '11:45:00', '13:15:00', 'Istirahat (11:45-13:15)', 6, 0, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(7, '13:15:00', '14:00:00', 'Slot 6 (13:15-14:00)', 7, 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(8, '14:00:00', '14:45:00', 'Slot 7 (14:00-14:45)', 8, 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(9, '14:45:00', '15:30:00', 'Slot 8 (14:45-15:30)', 9, 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46'),
(10, '15:30:00', '16:15:00', 'Slot 9 (15:30-16:15)', 10, 1, '2025-11-16 16:55:46', '2025-11-16 16:55:46');

-- --------------------------------------------------------

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

--
-- Dumping data for table `tahun_ajaran`
--

INSERT INTO `tahun_ajaran` (`id`, `nama`, `tanggal_mulai`, `tanggal_selesai`, `is_aktif`, `created_at`, `updated_at`) VALUES
(1, '2025/2026', '2025-02-15', '2026-01-15', 1, '2025-11-16 17:08:10', '2025-11-16 17:08:10');

-- --------------------------------------------------------

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

--
-- Dumping data for table `tukar_jadwal`
--

INSERT INTO `tukar_jadwal` (`id`, `pemohon_id`, `sesi_jadwal_pemohon_id`, `mitra_id`, `sesi_jadwal_mitra_id`, `status`, `alasan_pemohon`, `jenis`, `alasan_penolakan`, `tanggal_diajukan`, `tanggal_diproses`, `created_at`, `updated_at`) VALUES
(2, 13, 218, NULL, NULL, 'disetujui', 'hhh', 'pindah', NULL, '2025-11-18 04:14:23', '2025-11-18 04:14:23', '2025-11-18 04:14:23', '2025-11-18 04:14:23'),
(3, 13, 220, 12, 332, 'disetujui', 'bbb', 'tukar', NULL, '2025-11-18 04:14:44', '2025-11-18 04:15:15', '2025-11-18 04:14:44', '2025-11-18 04:15:15'),
(4, 21, 361, NULL, NULL, 'disetujui', 'hhh', 'pindah', NULL, '2025-11-18 05:10:30', '2025-11-18 05:10:30', '2025-11-18 05:10:30', '2025-11-18 05:10:30');

-- --------------------------------------------------------

--
-- Table structure for table `tukar_jadwal_request`
--

CREATE TABLE `tukar_jadwal_request` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

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
  `last_seen_activity_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `foto_profil`, `peran`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `last_seen_activity_at`, `created_at`, `updated_at`) VALUES
(1, 'Superadmin', 'admin@unuha.ac.id', 'foto_profil/ecUBeaTPXq2HlhB9iQAZ7pFsL7eHe4Ln1kcjf6Sj.png', 'super_admin', '2025-11-16 16:55:46', '$2y$12$1n3KbQ73gHVY9q2iLrUVYuaseY3eNU9GWvUNMzss58AOXiPDb8tMm', NULL, NULL, NULL, NULL, NULL, '2025-11-16 16:55:46', '2025-11-17 08:37:27'),
(18, 'Wardianto', 'wardianto@unuha.ac.id', NULL, 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(19, 'Nirma', 'nirma@unuha.ac.id', 'foto_profil/7z2inedOmEAruucSnXNIZARopV7Wdtv5fnUoF7fd.png', 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-18 04:09:30'),
(20, 'M. Iqbal Mustofa', 'iqbal@stkipnurulhuda.ac.id', NULL, 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(21, 'Pamuji Muhamad Jakak', 'jakak@unha.ac.id', NULL, 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(22, 'Uli Rizki', 'uli@unuha.ac.id', NULL, 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(23, 'Anshori', 'anshori@unuha.ac.id', NULL, 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(24, 'Fitria Apriani', 'fitria@unuha.ac.id', NULL, 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(25, 'Nindy Devita Sari', 'nindyds@unuha.ac.id', NULL, 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(26, 'Mukhamad Fathoni', 'mukhamadfathoni@gmail.com', NULL, 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-17 04:08:07'),
(27, 'Mu\'arif', 'muarif@stkipnurulhuda.ac.id', NULL, 'dosen', NULL, '$2y$12$vE/u7Zs5P.t0GswSjO7ho.JrNVZAc0J/4w0eyjdAL8s/jcJOitYBS', NULL, NULL, NULL, NULL, NULL, '2025-11-17 04:08:07', '2025-11-17 04:08:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`),
  ADD KEY `activity_logs_is_public_activity_date_index` (`is_public`,`activity_date`),
  ADD KEY `activity_logs_created_at_index` (`created_at`);

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
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_is_read_index` (`user_id`,`is_read`),
  ADD KEY `notifications_created_at_index` (`created_at`);

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
  ADD KEY `sesi_jadwal_tanggal_index` (`tanggal`),
  ADD KEY `sesi_jadwal_override_slot_waktu_mulai_id_foreign` (`override_slot_waktu_mulai_id`),
  ADD KEY `sesi_jadwal_override_slot_waktu_selesai_id_foreign` (`override_slot_waktu_selesai_id`),
  ADD KEY `sesi_jadwal_override_laboratorium_id_foreign` (`override_laboratorium_id`);

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
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_laboratorium`
--
ALTER TABLE `booking_laboratorium`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `dosen`
--
ALTER TABLE `dosen`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jadwal_master`
--
ALTER TABLE `jadwal_master`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `kelas_mata_kuliah`
--
ALTER TABLE `kelas_mata_kuliah`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `laboratorium`
--
ALTER TABLE `laboratorium`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `program_studi`
--
ALTER TABLE `program_studi`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `semester`
--
ALTER TABLE `semester`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sesi_jadwal`
--
ALTER TABLE `sesi_jadwal`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=385;

--
-- AUTO_INCREMENT for table `slot_waktu`
--
ALTER TABLE `slot_waktu`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tahun_ajaran`
--
ALTER TABLE `tahun_ajaran`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tukar_jadwal`
--
ALTER TABLE `tukar_jadwal`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tukar_jadwal_request`
--
ALTER TABLE `tukar_jadwal_request`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

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
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `semester`
--
ALTER TABLE `semester`
  ADD CONSTRAINT `semester_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sesi_jadwal`
--
ALTER TABLE `sesi_jadwal`
  ADD CONSTRAINT `sesi_jadwal_jadwal_master_id_foreign` FOREIGN KEY (`jadwal_master_id`) REFERENCES `jadwal_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sesi_jadwal_override_laboratorium_id_foreign` FOREIGN KEY (`override_laboratorium_id`) REFERENCES `laboratorium` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sesi_jadwal_override_slot_waktu_mulai_id_foreign` FOREIGN KEY (`override_slot_waktu_mulai_id`) REFERENCES `slot_waktu` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sesi_jadwal_override_slot_waktu_selesai_id_foreign` FOREIGN KEY (`override_slot_waktu_selesai_id`) REFERENCES `slot_waktu` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tukar_jadwal`
--
ALTER TABLE `tukar_jadwal`
  ADD CONSTRAINT `tukar_jadwal_mitra_id_foreign` FOREIGN KEY (`mitra_id`) REFERENCES `dosen` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tukar_jadwal_pemohon_id_foreign` FOREIGN KEY (`pemohon_id`) REFERENCES `dosen` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tukar_jadwal_sesi_jadwal_mitra_id_foreign` FOREIGN KEY (`sesi_jadwal_mitra_id`) REFERENCES `sesi_jadwal` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tukar_jadwal_sesi_jadwal_pemohon_id_foreign` FOREIGN KEY (`sesi_jadwal_pemohon_id`) REFERENCES `sesi_jadwal` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
