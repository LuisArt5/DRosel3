# Tuxedo Admin — Claude Context

## Purpose
Multi-store tuxedo/formal wear rental management system. Handles the full rental lifecycle (reservation → pickup → return), customer profiles, inventory with RFID tagging, payments, alterations, bilingual UI (EN/ES), and contract printing.

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 18, Tailwind CSS (CDN via `app/layout.js`), Lucide React |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Linting | ESLint 9 (`eslint.config.mjs`) |
| Deployment | Vercel (`vercel.json`) |

## Key Directories
```
app/
  page.js              # Entire application — single monolithic component (~1,850 lines)
  layout.js            # Root HTML shell; loads Tailwind via CDN
  globals.css          # Tailwind imports, print styles, touch-size overrides
  supabase-schema.sql  # Canonical DB schema (tables, buckets, RLS outline)
  migration-v8.sql     # Multi-store migration (stores table + store_id FKs)
public/                # Static SVG assets
.env.local             # NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Build & Dev Commands
```bash
npm run dev      # Dev server → localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

## Database (Supabase PostgreSQL)
Core tables: `profiles`, `customers`, `inventory`, `rentals`, `alterations`, `payments`, `stores`.  
Storage buckets: `id-photos`, `store-logos`.  
Full schema: `app/supabase-schema.sql`. Multi-store migration: `app/migration-v8.sql`.

## Environment Variables
| Variable | Used at |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `app/page.js:15` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `app/page.js:16` |

Access control is enforced by Supabase Row Level Security — these public keys are safe to expose client-side.

## Auth & Roles
Three roles defined in `profiles.role`: `admin`, `staff`, `viewer`.  
Permission checks via `hasPermission(action)` — see `app/page.js` for role matrix.

## Additional Documentation
| File | When to check |
|---|---|
| [`.claude/docs/architectural_patterns.md`](.claude/docs/architectural_patterns.md) | Adding features, refactoring, or debugging state/data issues |
