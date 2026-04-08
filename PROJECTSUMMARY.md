# D'Rosel Tuxedo Rentals — Project Summary

## What It Is

A full-featured, multi-store tuxedo and formal wear rental management system built for small-to-medium rental shops. Replaces spreadsheets and generic POS software with a purpose-built web app that handles every step of the rental process.

## Tech Stack

- **Frontend**: React 18 + Next.js 16 (App Router), Tailwind CSS (CDN), Lucide React, Recharts
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel (connected to GitHub for auto-deploy)

## Architecture

Single monolithic React component in `app/page.js` (~2,300 lines). No sub-components. All state is flat `useState` at the component root. All data ops are inline Supabase calls — no service layer or API routes. Tab-based navigation driven by `activeTab` state.

## Database

7 tables: `profiles`, `customers`, `inventory`, `rentals`, `alterations`, `payments`, `stores`.  
2 storage buckets: `id-photos`, `store-logos`.  
Full RLS on all tables — authenticated users only.

## Tabs & Features

| Tab | What It Does |
|---|---|
| Today | Today's pickups, returns, reservations; overdue returns |
| Rentals | Full rental list; create, edit, delete; contract print |
| Customers | Customer profiles with measurements, ID photos, rental history |
| Inventory | Items by category; RFID; status tracking; add/edit/delete |
| Billing | Payment history; add payments per rental |
| Analytics | KPIs, charts, weekly/monthly/yearly filters, print report |
| Dry Cleaner | Items currently at the cleaner; mark returned |
| Stores | Store management (admin only) |
| Users | User management with role assignment (admin only) |

## Rental Lifecycle

```
Reserved → Picked Up → Returned → (items go to Dry Cleaner) → Available
                ↑
        Quick-pay if balance owed
```

## Analytics Charts

1. Revenue over time (line) or Weekly revenue + count (dual-axis bar when "This Week" selected)
2. Inventory utilization — top 10 items by times rented (bar)
3. Rentals by status (horizontal bar)
4. Revenue by payment method (bar)
5. Rentals by day of week (bar)
6. Top 10 customers by revenue (table)
7. Overdue & outstanding balances (table)
8. Print report — text-based report with all KPIs, status/payment breakdowns, top customers

## Multi-Store

Two stores share one database. Admin can view all stores; staff are locked to their assigned store. Inventory and rentals carry `store_id`. Rental form only shows inventory from the selected store.

## Bilingual

All UI strings in English and Spanish via a `translations` object. Toggle in the header.

## Role-Based Access

- **Admin** — full CRUD, user management, store management, all-store view
- **Staff** — create and edit; no delete; no user/store management; own store only
- **Viewer** — read-only

## Print Features

- **Rental Contract** — one-page contract with store header, item list, measurement worksheet, terms & conditions, signature line; triggered via `window.print()`
- **Analytics Report** — text-based KPI report, rental status breakdown, payment method breakdown, top customers

## Setup

1. Create Supabase project
2. Run: `supabase-schema.sql` → `migration-v8.sql` → `migration-rls.sql`
3. Create user in Supabase Auth + add `profiles` row with `role = admin`
4. Set `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. `npm install && npm run dev`
6. Deploy: push to GitHub → Vercel auto-deploys

## Cost

- Supabase free tier: up to 500 MB database, 1 GB storage, unlimited auth users
- Vercel free tier: unlimited deployments, 100 GB bandwidth/month
- Total: $0/month for typical small shop volume
