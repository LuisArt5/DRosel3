# D'Rosel Tuxedo Rentals

Multi-store tuxedo and formal wear rental management system. Handles the full rental lifecycle (reservation → pickup → return), customer profiles with measurements, inventory with categories and RFID tagging, payments, alterations, dry cleaner tracking, bilingual UI (EN/ES), contract printing, and analytics.

## Features

### Rental Lifecycle
- Create reservations with customer, items, event date, pickup/return dates
- Balance gate on pickup — must pay any remaining balance before marking picked up
- Return automatically sends items to dry cleaner (status: `cleaning`)
- Dry cleaner tab tracks items at cleaner; mark returned sets them back to `available`

### Customer Management
- Name, phone, email, address, notes
- ID photo upload with camera capture (iPad-friendly)
- Measurements (chest, waist, inseam, jacket size, neck, sleeve)
- Rental history

### Inventory Management
- Items with name, size, price, RFID tag, category, notes
- Status: available / rented / cleaning / maintenance
- Dynamic category system — create categories from the inventory form
- Filter inventory by category in the UI
- Store-scoped — rental form only shows inventory belonging to the selected store

### Multi-Store
- `stores` table with name, address, phone, logo, terms & conditions
- Store selector in header — admin sees all stores, staff locked to their store
- Inventory and rentals are store-scoped via `store_id` FK

### Payments & Billing
- Deposit tracking, partial payments, payment history per rental
- Payment methods: Cash, Card, Check, Other
- Balance auto-calculated including alterations
- Quick-pay modal triggered before pickup if balance is outstanding

### Alterations
- Multiple alterations per rental with description, cost, status
- Alteration costs added to rental balance automatically

### Contract Printing
- Print a single-page rental contract + measurements worksheet via `window.print()`
- Contract includes store logo, terms & conditions, item list with sizes, alteration table, signature lines

### Analytics
- Filters: This Week / This Month / This Year / All Time
- Charts: Revenue over time (line), Weekly revenue & rentals (dual-axis bar), Inventory utilization (bar), Rentals by status (horizontal bar), Revenue by payment method (bar), Rentals by day of week (bar)
- KPIs: Total rentals, Total revenue, Avg rental value, Outstanding, Utilization rate, Collection rate, Avg rental days, Late return rate
- Top customers table, Overdue balances table
- Print Report button — prints a clean text-based analytics report

### Other
- Bilingual UI — English / Spanish toggle
- Role-based access: Admin (full CRUD), Staff (no delete/user management), Viewer (read-only)
- Today's dashboard: pickups, returns, reservations for the current day

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 18, Tailwind CSS (CDN), Lucide React |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Deployment | Vercel |

---

## Database Setup

Run these SQL files **in order** in Supabase SQL Editor:

1. `app/supabase-schema.sql` — base tables (customers, inventory, profiles, rentals, alterations, payments, storage bucket)
2. `app/migration-v8.sql` — adds `stores` table and `store_id` columns to inventory/rentals/profiles
3. `app/migration-rls.sql` — enables RLS and creates access policies for all tables

Then in Supabase Authentication:
1. Create a user (email + password)
2. In Table Editor → `profiles`, insert a row: `id = <user UUID>`, `role = admin`

### Tables
| Table | Purpose |
|---|---|
| `profiles` | User roles and store assignment |
| `customers` | Customer info, measurements, ID photos |
| `inventory` | Items with size, price, RFID, category, status |
| `rentals` | Rental records linking customers to items |
| `alterations` | Alterations per rental |
| `payments` | Payment history per rental |
| `stores` | Store locations with branding |

### Storage Buckets
- `id-photos` — customer ID photos (public read, authenticated write)
- `store-logos` — store logo images (public)

---

## Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: Supabase Dashboard → Project Settings → API.

---

## Local Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

---

## User Roles

| Role | Capabilities |
|---|---|
| `admin` | Full CRUD, user management, store management, all stores |
| `staff` | Create and edit, no delete, no user/store management, own store only |
| `viewer` | Read-only |

---

## Troubleshooting

**App stuck on "Loading…"** — check Supabase URL and anon key in `.env.local`, restart dev server.

**Login fails** — verify user exists in Supabase Authentication and a `profiles` row exists with the correct UUID and role.

**Delete buttons fail** — RLS policies may not be applied. Run `app/migration-rls.sql` in SQL Editor.

**Today's section empty** — dates are computed in local timezone (not UTC), so this should be correct. Verify system clock.

**Contract only prints one page** — check that print CSS in `globals.css` is applied and the contract wrapper uses `position: static`.

---

## Version History

### Current (v8+)
- Multi-store support (stores table, store-scoped inventory and rentals)
- Inventory categories with dynamic creation
- Dry cleaner tracking tab
- Customer measurements on contract (measurements worksheet page)
- Balance-gate quick-pay before pickup
- Camera capture for ID photos (iPad support)
- Analytics: weekly view, print report, 3 new charts
- Full RLS policies on all tables

### v7
- User authentication, role-based access
- Bilingual UI (EN/ES)
- Payment tracking, alteration management
- Contract printing
- Dashboard with today's pickups/returns
