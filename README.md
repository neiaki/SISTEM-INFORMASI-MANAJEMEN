# AcadTrack — Sistem Informasi Manajemen Tugas & Proyek Kuliah

Platform web manajemen tugas dan proyek perkuliahan untuk mahasiswa, dosen, admin, dan staff TU — dibangun dengan Next.js 15 App Router + React 19 + Tailwind CSS v4.

Landing page: `/` | Login: `/auth/login`

---

## Fitur Utama

### Landing Page (`/`)
- Hero section dengan animasi floating badge
- Ekosistem section dengan count-up stats (mahasiswa, dosen, jurnal)
- Fitur unggulan cards dengan hover icon animation
- Testimoni section
- FAQ accordion
- Newsletter subscribe form
- Sticky navbar dengan active section highlight & scroll progress bar
- Back-to-top button
- Dark mode toggle
- Mobile hamburger menu
- Footer dengan modal info per link

### Mahasiswa
| Modul | Deskripsi |
|---|---|
| **Dashboard** | Ringkasan tugas aktif, deadline mendekat, dan progres semester |
| **Tugas** | Daftar tugas per mata kuliah dengan status, prioritas, filter deadline; submit file & komentar |
| **Proyek** | Manajemen proyek kelompok dengan modal detail lengkap dan buat proyek baru |
| **Kelompok** | Lihat anggota kelompok, kirim undangan, edit kapasitas (maks 10), kick anggota, terima/tolak undangan masuk |
| **Participant** | Daftar seluruh peserta (24 mahasiswa) dari data terpusat |
| **Kalender** | Tampilan kalender deadline tugas dan milestone proyek |
| **Laporan** | Statistik progres personal per mata kuliah |
| **Log Aktivitas** | Riwayat aktivitas tugas dan proyek |
| **Notifikasi** | Reminder deadline dan update tugas |

### Dosen
| Modul | Deskripsi |
|---|---|
| **Dashboard** | Overview kelas, tugas aktif, widget "Baru Dikumpulkan" live dari localStorage, progres chart |
| **Mata Kuliah** | Daftar mata kuliah yang diampu; klik untuk lihat submission tracker per tugas |
| **Tugas** | Buat, edit, hapus tugas; filter per mata kuliah & status (Semua/Aktif/Selesai); status otomatis |
| **Kelompok** | Buat kelompok manual atau acak otomatis (RNG fair); edit anggota dan ukuran kelompok |
| **Mahasiswa** | Data mahasiswa per mata kuliah dengan modal detail per kelas |
| **Rekap** | Rekapitulasi pengumpulan & komentar; dismiss per item atau tutup semua; reset ke seed data |
| **Proyek** | Manajemen proyek kelas |
| **Laporan** | Statistik dan insight per mata kuliah |
| **Log Aktivitas** | Riwayat aktivitas pengelolaan tugas |
| **Notifikasi** | Kirim reminder ke mahasiswa |

### Admin
| Modul | Deskripsi |
|---|---|
| **Dashboard** | Overview seluruh aktivitas sistem |
| **Tugas** | Pantau dan kelola semua tugas di seluruh mata kuliah |
| **Laporan** | Laporan agregat seluruh program studi |
| **Notifikasi** | Kelola notifikasi sistem |

### Staff TU
| Modul | Deskripsi |
|---|---|
| **Dashboard** | Overview administrasi akademik |
| **Tugas** | Pantau tugas yang memerlukan tindakan administratif |
| **Laporan** | Laporan administratif dan rekap data |
| **Notifikasi** | Notifikasi urusan tata usaha |

### Bantuan (`/bantuan`, `/bantuan/panduan`)
Pusat bantuan dengan penjelasan fitur per section dan panduan pengguna step-by-step untuk role Mahasiswa dan Dosen.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 (CSS-first config di `app/globals.css`) |
| Komponen | shadcn/ui (Radix UI primitives) |
| Language | TypeScript |
| State | `useState` / `localStorage` (no backend) |
| Icons | Lucide React |
| Fonts | Clash Display (heading) + Poppins (body) |

> Aplikasi berjalan sebagai **frontend-only prototype** — semua data bersifat mock (seed data + localStorage). Tidak ada database atau API nyata.

---

## Struktur Direktori

```
app/
├── page.tsx            # Landing page (AcadTrack)
├── auth/
│   └── login/          # Halaman login (pilih role) + admin login
├── bantuan/            # Pusat bantuan & panduan pengguna
├── mahasiswa/          # Dashboard & modul mahasiswa
│   ├── tugas/
│   ├── proyek/
│   ├── kelompok/
│   ├── participant/
│   ├── kalender/
│   ├── laporan/
│   ├── log/
│   └── notifikasi/
├── dosen/              # Dashboard & modul dosen
│   ├── matakuliah/
│   ├── tugas/
│   ├── kelompok/
│   ├── mahasiswa/
│   ├── rekap/
│   ├── proyek/
│   ├── laporan/
│   ├── log/
│   └── notifikasi/
├── admin/              # Dashboard & modul admin
│   ├── tugas/
│   ├── laporan/
│   └── notifikasi/
└── staff-tu/           # Dashboard & modul staff TU
    ├── tugas/
    ├── laporan/
    └── notifikasi/

components/
├── ui/                 # shadcn/ui primitives
├── empty-state.tsx
├── task-detail-panel/
└── theme-provider.tsx

lib/
├── taskStore.ts        # Store state tugas + seed submissions & comments
├── kelompokStore.ts    # Store state kelompok
├── proyekStore.ts      # Store state proyek
├── notifStore.ts       # Store state notifikasi
├── activityLog.ts      # Helper log aktivitas
├── exportUtils.ts      # Utilitas ekspor/download
├── search-context.tsx  # Context pencarian global
└── students-data.ts    # Data mock 24 mahasiswa (shared)

data/
└── sim-data.ts         # Semua mock data dan konstanta konfigurasi
```

---

## Menjalankan Proyek

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

---

## Role & Akses

Login di `/auth/login` — pilih role untuk masuk ke dashboard yang sesuai:

| Role | Tema Warna | Akses |
|---|---|---|
| **Mahasiswa** | Amber / Teal | Tugas, proyek, dan aktivitas pribadi |
| **Dosen** | Forest / Gold on Cream | Manajemen kelas, tugas, kelompok, dan penilaian |
| **Admin** | `adm-*` vars | Pantau seluruh sistem dan laporan agregat |
| **Staff TU** | `stu-*` vars | Administrasi akademik dan laporan TU |

Tidak ada autentikasi nyata; semua state bersifat lokal (`localStorage`).

---

## Rencana Pengembangan

- [ ] Backend & database (Next.js API Routes + PostgreSQL/Prisma)
- [ ] Autentikasi nyata (NextAuth.js / JWT)
- [ ] Integrasi SIAKAD untuk impor data mahasiswa & mata kuliah
- [ ] Notifikasi email dan Telegram bot
- [ ] Integrasi LMS kampus
- [ ] Export rekap ke PDF / Excel
- [ ] Mobile-responsive layout yang dioptimalkan
