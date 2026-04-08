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
  page.js              # Entire application — single monolithic component (~2,300 lines)
  layout.js            # Root HTML shell; loads Tailwind via CDN
  globals.css          # Tailwind imports, print styles (contract + analytics), touch-size overrides
  supabase-schema.sql  # Canonical DB schema (tables, buckets, RLS outline)
  migration-v8.sql     # Multi-store migration (stores table + store_id FKs)
  migration-rls.sql    # RLS policies for all tables (customers, inventory, rentals, alterations, payments, profiles, storage)
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

## Tabs
`dashboard` (today's pickups/returns/reservations), `rentals`, `customers`, `inventory`, `billing`, `analytics`, `cleaner` (dry cleaner), `stores` (admin-only), `users` (admin-only).

## Key Features Added (beyond original scaffold)
- **Multi-store**: `stores` table, `store_id` FK on inventory/rentals/profiles, store selector in header
- **Inventory categories**: dynamic from inventory data, filter UI with `<datalist>` for new categories
- **Dry cleaner tab**: tracks items with `status = 'cleaning'`, mark returned → sets back to `available`
- **Contract print**: single-page contract + measurements worksheet, `window.print()` with `#contract-print-wrapper`
- **Analytics**: weekly/monthly/yearly/all-time filters; charts — revenue over time, weekly bar, inventory utilization, status breakdown, payment method breakdown, day-of-week; print report via `#analytics-print-wrapper`
- **Quick-pay modal**: balance gate on pickup — must pay balance before marking picked up; callback pattern via `quickPayOnComplete`
- **Camera support**: `capture="environment"` on ID photo input for iPad use
- **Today section**: local date (not UTC) to avoid timezone off-by-one; `todayReservations` state

## Database Setup Order
Run SQL files in this order in Supabase SQL Editor:
1. `app/supabase-schema.sql` — base tables
2. `app/migration-v8.sql` — stores table + store_id columns
3. `app/migration-rls.sql` — all RLS policies

## Additional Documentation
| File | When to check |
|---|---|
| [`.claude/docs/architectural_patterns.md`](.claude/docs/architectural_patterns.md) | Adding features, refactoring, or debugging state/data issues |
