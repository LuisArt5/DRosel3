# Quick Start — D'Rosel Tuxedo Rentals

## 5-Minute Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait ~2 minutes for it to provision

### Step 2: Run Database Scripts

In your Supabase project, go to **SQL Editor** and run these files **one at a time**, in order:

1. Open `app/supabase-schema.sql` → copy all → paste → Run
2. Open `app/migration-v8.sql` → copy all → paste → Run
3. Open `app/migration-rls.sql` → copy all → paste → Run

### Step 3: Create Your Admin User

1. In Supabase → **Authentication → Users** → Add user → Create new user
2. Enter email and password, confirm email: Yes
3. **Copy the user UUID** that appears

### Step 4: Assign Admin Role

1. Supabase → **Table Editor → profiles** → Insert row
2. Set: `id` = (paste UUID), `role` = `admin`
3. Save

### Step 5: Configure Environment

1. Copy your Supabase credentials: **Project Settings → API**
   - Project URL
   - anon / public key
2. Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 6: Run the App

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and log in.

---

## First Steps After Login

### Add a Store
1. Go to **Stores** tab (admin only)
2. Click ADD STORE → fill in name, address, phone → Save

### Add Inventory
1. Go to **Inventory** tab
2. Click ADD ITEM → fill in name, size, price, category → Save

### Add a Customer
1. Go to **Customers** tab
2. Click ADD CUSTOMER → fill in name, phone → Save
3. Optionally add measurements and take/upload ID photo

### Create a Rental
1. Go to **Rentals** tab
2. Click NEW RENTAL
3. Select store, customer, items, dates, deposit → Save

### Process Pickup
1. Go to **Today** tab
2. Find the rental in TODAY'S PICKUPS
3. If balance is owed, pay it first (Quick Pay modal)
4. Click MARK PICKED UP

### Process Return
1. Go to **Today** tab (or Rentals tab)
2. Click CHECK IN NOW — items automatically move to Dry Cleaner

### Mark Items Cleaned
1. Go to **Dry Cleaner** tab
2. Click MARK RETURNED — items go back to Available

---

## Deploy to Vercel (Make It a Website)

1. Push code to GitHub (already done if you're reading this there)
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy — live in ~2 minutes

---

## Common Issues

| Problem | Fix |
|---|---|
| Stuck on "Loading…" | Check `.env.local` values, restart dev server |
| Can't log in | Verify user in Supabase Auth + profile row with correct UUID |
| Delete buttons fail | Run `migration-rls.sql` in SQL Editor |
| Items not in rental form | Add inventory first; items must belong to selected store |
| Contract won't print page 2 | Already fixed — prints as static layout |

---

## Useful Commands

```bash
npm run dev      # Start local dev server
npm run build    # Build for production
npm run lint     # Check for lint errors
git push         # Push to GitHub (triggers Vercel deploy)
```
