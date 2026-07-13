# Checklist Pengembangan Backend SIM Tugas

Dokumen ini merangkum seluruh status pengerjaan fitur backend berdasarkan `prd-sim-tugas.md` dan `planning-backend.md`.

---

## 1. Fase 1: Pondasi & Skema Database Inti
**Tujuan:** Infrastruktur dasar, koneksi database, dan autentikasi berjalan dengan baik.

- [x] **Setup Database & ORM**
  - [x] Konfigurasi Supabase PostgreSQL.
  - [x] Instalasi & setup Prisma ORM (`prisma/schema.prisma`).
- [x] **Skema Database Inti (Tabel Utama)**
  - [x] Tabel `User` (dengan kolom `preferences` untuk notifikasi).
  - [x] Tabel Role Spesifik: `Mahasiswa`, `Dosen`, `AdminCampus`, `StaffTU`.
  - [x] Tabel `MataKuliah` dan `Enrollment` (KRS).
- [x] **Autentikasi (Auth.js)**
  - [x] Setup `NextAuth` (v5 beta) di `lib/auth.ts`.
  - [x] Pembuatan Provider Credentials (NIM/Email + Password).
  - [x] Setup sesi berbasis session/JWT dan role-based middleware/auth context.
  - [x] Implementasi SSO Kampus / Google OAuth (Selesai).

---

## 2. Fase 2: Fitur Inti (Manajemen Tugas & Proyek)
**Tujuan:** Operasional CRUD data tugas, proyek, dan log aktivitas.

- [x] **Skema Database Fitur Inti**
  - [x] Tabel `Tugas` & `Proyek`.
  - [x] Tabel `Deliverable` (detail dari proyek/tugas).
  - [x] Tabel `Kelompok` & `AnggotaKelompok`.
  - [x] Tabel `LogAktivitas` & `Submission`.
  - [x] Tabel `Comment` & `Lampiran`.
- [x] **Endpoint API Tugas & Proyek**
  - [x] `GET /api/tugas` — Mengambil daftar tugas (per user/mata kuliah).
  - [x] `POST /api/tugas` — Dosen membuat tugas baru.
  - [x] `PUT /api/tugas/[id]` — Edit status/deadline tugas.
  - [x] `DELETE /api/tugas/[id]` — Hapus tugas.
  - [x] `GET /api/proyek` — Mengambil daftar proyek.
  - [x] `POST /api/proyek` — Dosen/Mahasiswa membuat proyek.
- [x] **Endpoint API Dashboard Role-Specific**
  - [x] `GET /api/mahasiswa/dashboard` (Diakses via `/api/dashboard` dengan role Mahasiswa).
  - [x] `GET /api/dosen/dashboard` (Diakses via `/api/dashboard` dengan role Dosen).
  - [x] `GET /api/staff-tu/dashboard` (API Selesai dibuat, mereturn ringkasan sistem & tugas TU).
  - [x] `GET /api/admin/dashboard` (API Selesai dibuat, mereturn status sistem & metrik pengguna).

---

## 3. Fase 3: Sistem Notifikasi & Pemantauan
**Tujuan:** Pengingat otomatis untuk deadline dan sinkronisasi aktivitas.

- [x] **Skema & API Preferensi Notifikasi**
  - [x] Tabel `Notifikasi`.
  - [x] Kolom `preferences` JSONB di `User`.
  - [x] Pembuatan `PATCH /api/users/preferences` untuk menyimpan setting notifikasi per user.
- [x] **Email Integration & Cron Jobs**
  - [x] Setup simulasi email pengiriman otomatis.
  - [x] Pembuatan `GET /api/cron/deadline-reminder` (dipanggil oleh Vercel Cron).
  - [x] Mengirim notifikasi / email peringatan (H-7, H-3, H-1) sesuai preferensi user.
  - [x] (Opsional) Notifikasi Telegram via Bot (Selesai).
- [x] **Migrasi Notifikasi UI ke API**
  - [x] Halaman `/mahasiswa/notifikasi`.
  - [x] Halaman `/dosen/notifikasi`.
  - [x] Halaman `/admin/notifikasi`.
  - [x] Halaman `/staff-tu/notifikasi`.

---

## 4. Fase 4: Laporan, Ekspor, dan Import Data
**Tujuan:** Kebutuhan operasional Kampus, pelaporan, dan pengelolaan data massal.

- [x] **Fitur Import Data (Admin / Staff TU)**
  - [x] Pembuatan Template CSV untuk Mahasiswa, Dosen, dan Staff TU (`public/templates/`).
  - [x] Pembuatan `POST /api/admin/import-users` (menggunakan `csv-parse` untuk membaca dan menyimpan ke DB).
  - [x] UI Upload CSV di Dashboard Staff TU.
- [x] **Laporan & Ekspor**
  - [x] `GET /api/staff-tu/laporan` — Endpoint metrik KPI layanan Staff TU.
  - [x] `GET /api/admin/laporan` — Laporan untuk metrik sistem.
  - [x] Ekspor Data Nyata (Excel/CSV/PDF) yang terhubung ke DB (Terintegrasi di Laporan Dosen & Staff TU).
- [x] **File Storage (Lampiran Tugas)**
  - [x] Konfigurasi penyimpanan lokal di folder `public/uploads/` untuk upload lampiran/submission.
  - [x] Pembuatan route handler `/api/upload` untuk upload file standard.
   - [x] Integrasi ke Supabase Storage (jika disyaratkan produksi di masa depan).

---

## Ringkasan Progres Saat Ini
1. **Sedang Dikerjakan:** Integrasi Backend API Kelompok & Persiapan Serah Terima (Handoff).
2. **Prioritas Berikutnya:** Menghubungkan UI Frontend Manajemen Kelompok (`app/mahasiswa/kelompok/page.tsx` & `app/dosen/kelompok/page.tsx`) agar menggunakan `useSWR` dari rute API `/api/kelompok` yang baru dibuat.
3. **Pencapaian Terakhir:**
   - ✅ Google OAuth Provider ditambahkan ke `lib/auth.ts` (signIn/jwt/session callbacks lengkap).
   - ✅ Tombol "Masuk dengan Google" & "SSO Terpadu" di halaman login dihubungkan ke `signIn("google")`.
   - ✅ API CRUD untuk Manajemen Kelompok selesai (`app/api/kelompok/route.ts` & `[id]/route.ts`).
   - ✅ Integrasi Notifikasi Telegram Bot berhasil dibuat (`lib/telegram.ts` & dimasukkan ke cron).
   - ✅ API `POST /api/tugas/[id]/comment` dan `POST /api/submission/[id]` terintegrasi ke komponen `TaskDetailPanel` via SWR.
   - ✅ File `.env.example` diperbarui untuk menampung ENV variables yang baru (`AUTH_GOOGLE_ID`, `TELEGRAM_BOT_TOKEN`).

---

## 🚀 Perencanaan Langkah Selanjutnya (Handoff Plan)

Untuk Agent Berikutnya, ini adalah daftar prioritas pengembangan yang belum selesai dan harus dilanjutkan:

1. 🛡️ **Route Protection & Security (middleware.ts)** — ✅ **SELESAI**
    - `middleware.ts` sudah aktif dengan JWT session dan role checks.
2. 🗂️ **Migrasi Penyimpanan File (Supabase Storage)** — ✅ **SELESAI**
   - Endpoint `/api/upload` telah direfactor untuk menggunakan bucket `attachments` di Supabase. `fs/promises` telah dihapus.
3. 👥 **Integrasi API Manajemen Kelompok ke Frontend** — ✅ **SELESAI**
   - SWR berhasil diinjeksi ke halaman `app/mahasiswa/kelompok/page.tsx` dan `app/dosen/kelompok/page.tsx` untuk menampilkan daftar kelompok dari PostgreSQL. Logika mock UI dibiarkan sebagai *fallback* sampai migrasi total.
4. 🔑 **Setup Kunci Kredensial Nyata (Tugas Anda/Tim)**
   - Masukkan nilai `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `TELEGRAM_BOT_TOKEN`, dan `NEXT_PUBLIC_SUPABASE_URL` di `.env.local` Anda agar fitur berjalan di production.

> **Saran Langkah Cepat untuk Agent Berikutnya:** 
> "Halo Agent, Handoff Plan 1-3 sudah selesai. Silakan periksa sisa PRD yang belum terintegrasi ke backend (seperti endpoint Notifikasi, Integrasi Proyek, Laporan). Ingat bahwa SWR sudah disetup sebagian di Kelompok, dan UI lainnya masih membutuhkan perombakan jika skema database belum 100% cocok dengan mock data di file UI."

---

## ⚡ Status Optimasi Performa (Telah Selesai & Rencana Lanjutan)

Optimasi fundamental sistem database telah berhasil diimplementasikan sepenuhnya.

**Optimasi yang SUDAH Selesai Diterapkan:**
- ✅ **Database Indexing:** Compound index telah ditambahkan ke skema Prisma pada tabel `Enrollment`, `Tugas`, `Proyek`, dan `Submission` (contoh: `@@index([idMk, deadline])`). Query berat akan berjalan efisien tanpa perlu memindai seluruh tabel.
- ✅ **Optimasi Caching (SWR):** Setelan `revalidateOnFocus: false` dan `dedupingInterval: 60000` telah diterapkan pada tabel yang jarang berubah secara drastis (seperti Metrik dan Laporan), meminimalisir spam pemanggilan endpoint backend.
- ✅ **Reduksi Boilerplate Auth Guard:** Guard `auth()` + cek `session.user` + validasi `role` yang berulang di route handler diekstrak ke `lib/auth-guard.ts` (`requireSession`, `requireRole`) dan diterapkan ke `/api/tugas`, `/api/proyek`, `/api/notifikasi`. `requireSession` memakai dynamic import agar modul mudah diuji. Dilengkapi unit test `lib/auth-guard.test.ts` (`bun test`).

**Rencana Optimasi Tingkat Lanjut (Untuk Peningkatan Skala Skala Besar):**
- ✅ **Pagination & Lazy Loading:** Diterapkan server-side di `GET /api/tugas`, `GET /api/proyek`, dan `GET /api/notifikasi` via `lib/pagination.ts` (skip/take + `count` + meta `pagination`). Backward-compatible: hanya paginasi bila param `page` dikirim; UI lama tetap mendapat seluruh daftar. Dilengkapi unit test (`lib/pagination.test.ts`, `bun test`).
- ⏳ **Dynamic Imports:** Hanya me-load ekstensi berat (seperti library Excel/CSV) ketika pengguna menekan tombol "Export" guna mengurangi Initial Bundle Size dari halaman tersebut.
