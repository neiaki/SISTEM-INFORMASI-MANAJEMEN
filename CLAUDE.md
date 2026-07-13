# AGENTS.md

## Quick Start

```bash
npm run dev      # http://localhost:3000 (Turbopack)
npm run build
npm start
```

## Important Notes

- **No lint/test tooling** — `package.json` only has `dev`, `build`, `start`. No `lint`/`test` scripts.
- **Backend migration in progress** — selain frontend mock (`lib/*Store.ts` + localStorage), sudah ada Next.js Route Handlers di `app/api/**` + Prisma + Auth.js v5 (`lib/auth.ts`). Keduanya masih coexist; belum sepenuhnya cut-over.
- **Tailwind v4** — CSS-first config in `app/globals.css` (`@theme inline`), no `tailwind.config.js`
- **React Compiler** enabled via `next.config.ts` (`experimental.reactCompiler: true`)
- **Path alias**: `@/*` maps to project root (`./*` in `tsconfig.json`)

## Database / Prisma Gotchas

- `lib/prisma.ts` **hardcode** datasource URL `postgresql://postgres@localhost:5432/db_sim_tugas?schema=public` — ini meng-override `DATABASE_URL` dari `.env`. Berarti target asli adalah **Postgres lokal** bernama `db_sim_tugas`, bukan Supabase (meski `.env.example` menyarankan Supabase). Ubah file ini bila mau ganti DB.
- DB lokal harus sudah ada sebelum `prisma` jalan. Perintah:
  ```bash
  npx prisma generate          # generate client
  npx prisma migrate dev       # terapkan skema ke DB lokal
  npx prisma db seed           # seed (jalankan ts-node prisma/seed.ts)
  ```
- `NEXT_PUBLIC_DEMO_MODE` ada di `.env` tapi saat ini hanya dipakai di `app/auth/login/page.tsx`, bukan global bypass. Jangan asumsikan mock otomatis aktif.

## Architecture

- **4 roles**: Mahasiswa, Dosen, Admin, Staff TU — selectable at `/auth/login`
- **State**: `useState` + localStorage (no real auth, no backend)
- **Routing**: Next.js App Router — role-specific layouts under `/app/{mahasiswa,dosen,admin,staff-tu}/`
- **Public pages**: `/features`, `/demo`, `/bantuan`, `/panduan`, `/legal`

## Key Files

| Path | Purpose |
|------|---------|
| `data/sim-data.ts` | All mock data, AUTH_MODES, SECTION_OPTIONS |
| `lib/taskStore.ts` | Task state management |
| `lib/kelompokStore.ts` | Group state management |
| `lib/proyekStore.ts` | Project state management |
| `lib/notifStore.ts` | Notification state |
| `app/globals.css` | Theme variables (`mhs-*`, `dsn-*`, `adm-*`, `stu-*`) |
| `planning-backend.md` | Backend migration plan (Supabase + Prisma + Auth.js) |
| `checklist-backend.md` | Pelacakan status pengerjaan fitur backend |

## Commit Rule

Never add `Co-Authored-By` or Claude attribution to commit messages.

## Coding Guidelines

**Clean Code & Minim Boilerplate:**
1. **Single Responsibility (SRP):** Keep components and API handlers focused on a single task. Extract complex logic into helper functions (`lib/`) and UIs into separate components (`components/`).
2. **Naming Conventions:** Use `camelCase` for variables/functions and `PascalCase` for React components. Use descriptive names instead of abbreviations.
3. **Early Returns:** Prefer early returns to avoid deeply nested `if/else` statements.
4. **Boilerplate Reduction:** 
   - Encapsulate repetitive API responses into utility functions.
   - Extract repeated state management (like data fetching with SWR) into custom hooks (e.g. `useTugas()`).
   - Create reusable UI components for common elements (Buttons, Cards, Inputs) to avoid duplicating long Tailwind class strings.

**Backend Development Rules:**
1. **Pembaruan Checklist**: Selalu perbarui status penyelesaian fitur/endpoint di dalam `checklist-backend.md` segera setelah fitur tersebut berhasil diimplementasikan dan diuji.
2. **Template CSV & Impor Data**: Template CSV standar untuk impor massal diletakkan di `public/templates/` (`template-import-mahasiswa.csv`, `template-import-dosen.csv`, `template-import-staff.csv`). Jika skema database di tabel terkait berubah, template tersebut harus diperbarui secara manual agar tetap sinkron.
