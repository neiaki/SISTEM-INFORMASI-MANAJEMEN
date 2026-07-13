# Rencana Backend SIM Tugas

## Analogi Sederhana

Bayangkan aplikasi ini seperti sebuah **warung makan**:
- **Frontend** (yang sudah ada) = tampilan warung — meja, kursi, menu di dinding
- **Backend** = dapur + kasir + gudang bahan makanan
- **Database** = gudang penyimpanan semua bahan dan data pesanan

---

## Teknologi yang Akan Dipakai

> Semua ini bekerja **di dalam proyek Next.js yang sudah ada** — tidak perlu buat server terpisah.

| Komponen | Teknologi | Fungsi | Kesulitan |
|---|---|---|---|
| **Database** | Supabase | Tempat simpan semua data (PostgreSQL gratis) | ⭐ Mudah |
| **ORM** | Prisma | "Penerjemah" antara kode TypeScript dan database | ⭐⭐ Mudah |
| **Autentikasi** | Auth.js (NextAuth v5) | Login, sesi, logout otomatis | ⭐⭐ Mudah |
| **API** | Next.js Route Handlers | Jembatan antara tampilan dan database | ⭐⭐ Mudah |
| **Email** | Resend | Kirim email notifikasi/reset password | ⭐ Mudah |
| **File Upload** | Supabase Storage | Simpan file lampiran tugas | ⭐⭐ Mudah |

---

## Rencana Fase

### Fase 1 — Pondasi (2–3 minggu)
**Tujuan: Bisa login dan data tersimpan ke database**

Langkah-langkah:
1. Setup Supabase (database gratis online)
2. Hubungkan Prisma ke Supabase
3. Buat tabel database:
   - `users` (akun login)
   - `mahasiswa`, `dosen`, `admin`, `staff_tu`
   - `mata_kuliah`
   - `enrollment` (mahasiswa ambil mata kuliah apa)
4. Pasang Auth.js → login NIM+password bisa jalan
5. Ganti data mock (`data/sim-data.js`) → ambil dari database sungguhan

**Hasil:** Login beneran, data tersimpan permanen (tidak hilang saat refresh)

---

### Fase 2 — Fitur Inti (3–4 minggu)
**Tujuan: CRUD tugas dan proyek berfungsi**

Langkah-langkah:
1. Buat tabel: `tugas`, `proyek`, `deliverable`, `kelompok`, `anggota_kelompok`, `log_aktivitas`, `lampiran`
2. Buat API endpoints:

   | Method | URL | Fungsi |
   |--------|-----|--------|
   | GET | `/api/tugas` | Ambil daftar tugas |
   | POST | `/api/tugas` | Buat tugas baru |
   | PUT | `/api/tugas/[id]` | Edit tugas |
   | DELETE | `/api/tugas/[id]` | Hapus tugas |
   | GET | `/api/proyek` | Ambil daftar proyek |
   | POST | `/api/proyek` | Buat proyek baru |
   | GET | `/api/dashboard` | Data ringkasan dashboard |

3. Sambungkan dashboard frontend ke API ini
4. Sistem prioritas otomatis (deadline terdekat = prioritas tinggi)
5. Log aktivitas (histori perubahan status)

**Hasil:** Tugas bisa dibuat, diedit, dihapus, dan tersimpan permanen

---

### Fase 3 — Notifikasi (2–3 minggu)
**Tujuan: Sistem kirim peringatan otomatis**

Langkah-langkah:
1. Setup Resend → kirim email (H-7, H-3, H-1 sebelum deadline)
2. Notifikasi in-app (badge/banner di dashboard)
3. Vercel Cron Jobs → sistem otomatis cek deadline setiap hari jam 07.00
4. Simpan riwayat notifikasi di tabel `notifikasi`
5. (Opsional) Telegram Bot → notifikasi via Telegram

**Hasil:** Sistem mengingatkan otomatis tanpa perlu manual

---

### Fase 4 — Laporan & Fitur Lanjutan (3–4 minggu)
**Tujuan: Laporan, upload file, import data**

Langkah-langkah:
1. Upload lampiran file → Supabase Storage
2. Laporan statistik (tugas selesai vs terlambat, per mata kuliah)
3. Export laporan ke PDF/Excel
4. Import data mahasiswa dari file Excel (untuk Staff TU)
5. (Opsional) Google Login (OAuth)
6. (Opsional) SSO kampus (LDAP/SAML)

**Hasil:** Sistem siap dipakai penuh oleh mahasiswa, dosen, admin, dan staff TU

---

## Skema Database Lengkap

Berikut semua tabel yang perlu dibuat berdasarkan PRD:

### Tabel Utama (Fase 1)
```
users            → id, username, password_hash, role, last_login
mahasiswa        → id, id_user, nama, NIM, email, no_hp, semester_aktif
dosen            → id, id_user, nama, email, no_hp, nidn
admin_kampus     → id, id_user, nama, email
staff_tu         → id, id_user, nama, email, unit
mata_kuliah      → id, nama_mk, kode_mk, id_dosen, semester, tahun_ajar
enrollment       → id, id_mahasiswa, id_mk, semester, tahun_ajar, status
```

### Tabel Fitur Inti (Fase 2)
```
tugas            → id, id_mk, judul, deskripsi, tanggal_diberikan, deadline,
                   bobot_nilai, jenis (individu/kelompok), status_global, tipe
proyek           → id, id_mk, nama_proyek, deskripsi, tanggal_mulai,
                   deadline_akhir, progres_proyek
deliverable      → id, id_tugas/id_proyek, nama_aktivitas, id_penanggung_jawab,
                   status, deadline_khusus, persentase_bobot
kelompok         → id, id_mk, id_proyek, nama_kelompok
anggota_kelompok → id_kelompok, id_mahasiswa, peran
log_aktivitas    → id, id_referensi, id_mahasiswa, tanggal, catatan, persen_progres
lampiran         → id, id_referensi, id_mahasiswa, jenis (file/link), path_file, url
```

### Tabel Notifikasi (Fase 3)
```
notifikasi       → id, id_user, judul, pesan, jenis, waktu_kirim,
                   status_baca, channel (in-app/email/telegram)
```

---

## Alur Data (Cara Kerja)

```
User klik tombol di browser
        ↓
Next.js Frontend (yang sudah ada)
        ↓
Next.js API Route (/api/...)   ← ini yang akan dibuat
        ↓
Prisma (ORM / penerjemah)
        ↓
Supabase Database (PostgreSQL)
```

---

## Struktur Folder yang Akan Ditambahkan

```
app/
  api/                      ← folder baru untuk semua API
    auth/
      [...nextauth]/
        route.ts            ← endpoint login/logout Auth.js
    tugas/
      route.ts              ← GET semua tugas, POST buat tugas baru
      [id]/
        route.ts            ← GET, PUT, DELETE tugas by ID
    proyek/
      route.ts
    dashboard/
      route.ts
    notifikasi/
      route.ts
      cron/
        route.ts            ← dipanggil Vercel Cron setiap hari

prisma/
  schema.prisma             ← definisi semua tabel database

lib/
  prisma.ts                 ← koneksi ke database (singleton)
  auth.ts                   ← konfigurasi Auth.js

.env.local                  ← menyimpan API keys (JANGAN di-commit ke git)
```

---

## Urutan Langkah Memulai

Kalau mau mulai sekarang, urutan yang tepat:

1. **Buat akun Supabase gratis** di https://supabase.com
2. **Install Prisma** → `npm install prisma @prisma/client`
3. **Tulis schema database** di `prisma/schema.prisma`
4. **Jalankan migrasi** → tabel otomatis terbuat di Supabase
5. **Install Auth.js** → `npm install next-auth@beta`
6. **Buat halaman login** yang terhubung ke database
7. Satu per satu ganti data mock ke API route + database

---

## Checklist Progress

### Fase 1 — Pondasi
- [x] Buat akun Supabase
- [x] Install dan konfigurasi Prisma
- [x] Tulis schema database (users, mahasiswa, dosen, mata_kuliah, enrollment)
- [x] Jalankan migrasi database pertama
- [x] Install Auth.js
- [x] Buat API route login (`/api/auth/[...nextauth]`)
- [x] Sambungkan halaman login frontend ke Auth.js
- [x] Test login dengan akun dummy dari database

### Fase 2 — Fitur Inti
- [x] Tambah tabel tugas, proyek, deliverable, kelompok ke schema
- [x] Buat API route CRUD tugas
- [x] Buat API route CRUD proyek
- [x] Buat API route dashboard
- [x] Sambungkan frontend mahasiswa ke API (Modul Tugas)
- [x] Sambungkan frontend mahasiswa ke API (Modul Proyek)
- [x] Sambungkan frontend dosen ke API (Modul Tugas)
- [x] Sambungkan frontend dosen ke API (Modul Proyek)
- [x] Implementasi log aktivitas

### Fase 3 — Notifikasi (Sisa)
- [x] Implementasi notifikasi in-app
- [ ] Buat akun Resend (email gratis)
- [ ] Buat template email notifikasi
- [ ] Setup Vercel Cron Job harian
- [ ] Hubungkan UI preferensi Notifikasi dengan database (Mahasiswa, Dosen, Admin, Staff TU)
- [ ] (Opsional) Setup Telegram Bot

### Fase 4 — Laporan, Staff TU, & Admin Lanjutan
- [ ] Konfigurasi Supabase Storage untuk upload file lampiran
- [ ] Buat fitur export PDF/Excel
- [ ] Migrasi Dashboard & Halaman Staff TU (SWR + API)
- [ ] Buat fitur import Excel/CSV untuk Staff TU
- [ ] Migrasi Dashboard & Halaman Admin (SWR + API)
- [ ] (Opsional) Google Login
- [ ] (Opsional) SSO kampus

---

## Catatan Penting

- File `.env.local` wajib masuk ke `.gitignore` — jangan pernah di-push ke GitHub karena berisi password dan API key
- Mulai selalu dari yang paling sederhana dulu (Fase 1), jangan langsung lompat ke fitur kompleks
- Supabase menyediakan dashboard visual untuk melihat dan mengedit isi database — sangat membantu untuk pemula
- Prisma Studio (`npx prisma studio`) juga menyediakan UI untuk melihat data tanpa perlu SQL
