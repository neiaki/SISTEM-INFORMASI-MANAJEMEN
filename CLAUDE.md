# AGENTS.md

## Quick Start

```bash
npm run dev      # http://localhost:3000
npm run build
npm start
```

## Important Notes

- **No lint/test tooling configured** — `package.json` has no lint or test scripts
- **Frontend-only prototype** — no backend, no database; all data is mock + localStorage
- **Tailwind v4** — CSS-first config in `app/globals.css` (`@theme inline`), no `tailwind.config.js`

## Architecture

- **4 roles**: Mahasiswa (students), Dosen (lecturers), Admin, Staff TU
- **Entry point**: `/auth/login` — selects role and redirects to role-specific dashboard
- **State**: local `useState` + localStorage, no real auth
- **Path alias**: `@/*` maps to project root

## Key Files

| Path | Purpose |
|------|---------|
| `data/sim-data.ts` | All mock data, AUTH_MODES, SECTION_OPTIONS |
| `lib/taskStore.ts` | Task state management |
| `lib/kelompokStore.ts` | Group state management |
| `lib/notifStore.ts` | Notification state |
| `app/globals.css` | Theme variables (`mhs-*`, `dsn-*`, `adm-*`, `stu-*`) |

## Commit Rule

Never add `Co-Authored-By` or Claude attribution to commit messages.