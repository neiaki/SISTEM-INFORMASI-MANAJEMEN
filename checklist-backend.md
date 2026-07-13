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
  - [ ] Implementasi SSO Kampus / Google OAuth (Opsional - Tertunda).

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
  - [ ] (Opsional) Notifikasi Telegram via Bot.
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
- [ ] **Laporan & Ekspor**
  - [x] `GET /api/staff-tu/laporan` — Endpoint metrik KPI layanan Staff TU.
  - [x] `GET /api/admin/laporan` — Laporan untuk metrik sistem.
  - [x] Ekspor Data Nyata (Excel/CSV/PDF) yang terhubung ke DB (Terintegrasi di Laporan Dosen & Staff TU).
- [x] **File Storage (Lampiran Tugas)**
  - [x] Konfigurasi penyimpanan lokal di folder `public/uploads/` untuk upload lampiran/submission.
  - [x] Pembuatan route handler `/api/upload` untuk upload file standard.
  - [ ] Integrasi ke Supabase Storage (jika disyaratkan produksi di masa depan).

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

1. **Integrasi Frontend Manajemen Kelompok (Fokus Utama)**
   - Saat ini Backend CRUD Kelompok (Tahap 4) sudah selesai (`/api/kelompok`).
   - **Tugas Utama:** Refactor halaman `app/mahasiswa/kelompok/page.tsx` dan `app/dosen/kelompok/page.tsx` untuk menghapus penggunaan `kelompokStore.ts` (mock data lokal) dan menggantinya dengan fetch SWR asli ke `/api/kelompok`.
2. **Integrasi Supabase Storage (Tahap 2)**
   - File upload saat ini mengandalkan path lokal `/public/uploads` di server via `/api/upload/route.ts`.
   - **Tugas Utama:** Modifikasi endpoint upload agar langsung mengirim file fisik ke bucket Supabase Storage, kemudian menyimpan URL Publik Supabase tersebut ke PostgreSQL.
3. **Pengaturan Akun & Environment User**
   - Minta user atau secara manual siapkan nilai untuk variabel-variabel kredensial di file `.env.local` (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `TELEGRAM_BOT_TOKEN`) untuk memfungsikan fitur OAuth & Notif.
