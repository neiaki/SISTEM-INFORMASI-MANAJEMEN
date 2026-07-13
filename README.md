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
| **Proyek** | Tugas kelompok dengan workflow tracking (Aktif → Kumpul → Review → Selesai), sorting by deadline, tampilan nilai akhir, dan submit file/link |
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
| **Rekap** | Rekapitulasi pengumpulan & komentar; integrasi nilai riil dari database |
| **Proyek** | Manajemen proyek kelas; review submission, beri revisi/nilai, workflow tracking |
| **Laporan** | Statistik dan insight per mata kuliah dengan agregasi data dinamis |
| **Log Aktivitas** | Riwayat aktivitas pengelolaan tugas |
| **Notifikasi** | Kirim pengumuman (broadcast) ke mahasiswa |

### Admin
| Modul | Deskripsi |
|---|---|
| **Dashboard** | Overview seluruh aktivitas sistem |
| **Tugas** | Pantau dan kelola semua tugas di seluruh mata kuliah |
| **Laporan** | Laporan agregat seluruh program studi |
| **Notifikasi** | Kelola notifikasi sistem |
| **Import Data** | Import pengguna (Mahasiswa, Dosen, Staff TU) massal menggunakan format CSV |

### Staff TU
| Modul | Deskripsi |
|---|---|
| **Dashboard** | Overview administrasi akademik |
| **Tugas** | Pantau tugas yang memerlukan tindakan administratif |
| **Laporan** | Laporan administratif dan rekap data |
| **Notifikasi** | Notifikasi urusan tata usaha |

### Akses Publik & Bantuan
| Rute | Deskripsi |
|---|---|
| `/features` | Halaman interaktif untuk mengeksplorasi seluruh fitur unggulan AcadTrack. |
| `/demo` | Portal simulasi (Demo Publik) interaktif tanpa perlu login. |
| `/bantuan` | Pusat informasi pendukung seperti FAQ, Video Tutorial, dan Blog. |
| `/panduan` | Dokumentasi panduan pengguna step-by-step untuk Mahasiswa dan Dosen. |
| `/panduan/admin` | Dokumentasi panduan khusus untuk Admin dan Staff TU. |
| `/legal` | Syarat dan Ketentuan, serta Kebijakan Privasi platform. |

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 (CSS-first config di `app/globals.css`) |
| Komponen | shadcn/ui (Radix UI primitives) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Autentikasi | NextAuth.js (Auth.js) v5 |
| State | SWR untuk data fetching / Zustand / Context |
| Utilities | PapaParse (CSV Import), dll. |

> [!NOTE]
> Meskipun aplikasi ini telah menggunakan database PostgreSQL yang sesungguhnya (melalui Prisma), beberapa bagian UI, data *seed* default, dan logika saat ini masih sangat bersandar pada **data dummy** untuk keperluan demonstrasi prototipe. Data yang di-render di beberapa dashboard mungkin saja bersifat *mock* sampai semua endpoint API telah dimigrasikan sepenuhnya.

---

## Struktur Direktori Utama

```
app/
├── api/                # API Routes untuk koneksi backend (Prisma + PostgreSQL)
├── auth/               # Halaman autentikasi NextAuth.js
├── mahasiswa/          # Dashboard & modul mahasiswa
├── dosen/              # Dashboard & modul dosen
├── admin/              # Dashboard & modul admin
└── staff-tu/           # Dashboard & modul staff TU

components/
├── ui/                 # Komponen UI Reusable
└── ...

lib/
├── auth.ts             # Konfigurasi NextAuth.js
├── prisma.ts           # Instance Prisma Client
└── ...

prisma/
└── schema.prisma       # Skema database PostgreSQL
```

---

## Menjalankan Proyek

**Persiapan Database:**
Buat file `.env` di *root* dan sesuaikan dengan konfigurasi Anda:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_sim_tugas"
DIRECT_URL="postgresql://user:password@localhost:5432/db_sim_tugas"
AUTH_SECRET="your-secret-key"
```

**Instalasi & Migrasi:**
```bash
npm install
npx prisma db push
```

**Menjalankan Server:**
```bash
npm run dev      # http://localhost:3000
npm run build
npm start
```

---

## Role & Akses

Aplikasi sudah terhubung dengan autentikasi `NextAuth`. Terdapat 4 peran utama:
- **Mahasiswa** (`MAHASISWA`)
- **Dosen** (`DOSEN`)
- **Admin Campus** (`ADMIN`)
- **Staff TU** (`STAFF_TU`)

Terdapat fitur **Import via CSV** di dashboard Admin untuk mendaftarkan akun baru secara massal.

---

## Rencana Pengembangan Selanjutnya

- [ ] Integrasi SIAKAD API secara realtime
- [ ] Notifikasi email (Resend API) dan Telegram bot
- [ ] Integrasi LMS kampus
- [ ] Export rekap ke PDF / Excel tingkat lanjut
- [ ] Mobile-responsive layout tambahan
