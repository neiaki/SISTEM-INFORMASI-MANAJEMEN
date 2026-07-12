# AGENTS.md

## Quick Start

```bash
npm run dev      # http://localhost:3000 (Turbopack)
npm run build
npm start
```

## Important Notes

- **No lint/test tooling configured** — `package.json` has no lint or test scripts
- **Frontend-only prototype** — no backend, no database; all data is mock + localStorage
- **Tailwind v4** — CSS-first config in `app/globals.css` (`@theme inline`), no `tailwind.config.js`
- **React Compiler** enabled via `next.config.ts` (`experimental.reactCompiler: true`)
- **Path alias**: `@/*` maps to project root (configured in `tsconfig.json`)

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

## Commit Rule

Never add `Co-Authored-By` or Claude attribution to commit messages.
