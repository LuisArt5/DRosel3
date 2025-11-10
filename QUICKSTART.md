# Quick Start Guide - Tuxedo Rental Admin

## 🚀 5-Minute Setup

### Step 1: Supabase Database Setup (2 minutes)

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Project name: "tuxedo-rental"
   - Database password: (choose a strong password)
   - Region: (choose closest to you)
4. Click "Create new project" and wait 2 minutes

### Step 2: Run Database Script (1 minute)

1. In your Supabase project, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Open the `supabase-schema.sql` file from this project
4. Copy ALL the SQL code
5. Paste it into the Supabase SQL editor
6. Click "Run" (bottom right)
7. Wait for "Success" message

### Step 3: Create Your Admin Account (1 minute)

1. Click "Authentication" in the left sidebar
2. Click "Users" tab
3. Click "Add user" > "Create new user"
4. Enter:
   - Email: your@email.com
   - Password: (choose a strong password)
   - Confirm email: Yes
5. Click "Create user"
6. **IMPORTANT**: Copy the user ID (UUID) that appears - you'll need it next!

### Step 4: Make Yourself Admin (30 seconds)

1. Click "Table Editor" in left sidebar
2. Click "profiles" table
3. Click "Insert" > "Insert row"
4. Fill in:
   - id: (paste the user ID you just copied)
   - role: admin
5. Click "Save"

### Step 5: Configure Your App (30 seconds)

1. In Supabase, click "Settings" (gear icon) in left sidebar
2. Click "API"
3. Copy the "Project URL"
4. Copy the "anon public" key
5. In your project, rename `.env.local.template` to `.env.local`
6. Paste your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 6: Launch! (30 seconds)

```bash
npm install
npm run dev
```

Go to http://localhost:3000 and login with your email/password!

---

## ✅ Verification Checklist

Before you start using the system, verify:

- [ ] Can you login with your email/password?
- [ ] Do you see "ADMIN" badge in top right?
- [ ] Can you navigate between tabs?
- [ ] Can you click "ADD CUSTOMER"?

If all checks pass, you're ready to go! 🎉

---

## 🎯 First Tasks

### 1. Add Your First Items (Inventory)
1. Click "Inventory" tab
2. Click "ADD ITEM"
3. Fill in:
   - Name: "Black Tuxedo"
   - Size: "40R"
   - Price: 120
   - RFID: "T001" (optional)
4. Click SAVE
5. Repeat for a few more items

### 2. Add Your First Customer
1. Click "Customers" tab
2. Click "ADD CUSTOMER"
3. Fill in customer details
4. Click SAVE

### 3. Create Your First Rental
1. Click "Rentals" tab
2. Click "NEW RENTAL"
3. Select customer
4. Check boxes for items to rent
5. Set dates
6. Enter deposit
7. Click SAVE

---

## 🌐 Deploy to Internet (Optional)

### Quick Deploy to Vercel (FREE)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add Environment Variables:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: (your Supabase URL)
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: (your Supabase anon key)
6. Click "Deploy"

Your app will be live in 2 minutes! 🚀

---

## 📱 Test Scenarios

Try these to make sure everything works:

### Scenario 1: Weekend Wedding
1. Add customer "John Smith"
2. Add rental:
   - Event: Saturday wedding
   - Pickup: Thursday before
   - Return: Monday after
3. Check Dashboard shows it in upcoming pickups

### Scenario 2: Add Alterations
1. Edit the rental you just created
2. Scroll to Alterations section
3. Add "Hem pants - $15"
4. Notice balance updates automatically

### Scenario 3: Process Pickup
1. Go to Dashboard on Thursday (or change system date)
2. Click "MARK PICKED UP"
3. Check that rental status changed
4. Check that items now show as "rented" in Inventory

---

## 🆘 Common Issues

### "Missing environment variables"
- Check `.env.local` file exists
- Verify values are correct (no spaces, no quotes)
- Restart dev server: Ctrl+C then `npm run dev`

### Can't login
- Verify user exists in Supabase Authentication
- Check profile record has correct user ID
- Password must be at least 6 characters

### "Profiles table doesn't exist"
- Re-run the SQL script in Supabase
- Check for error messages in SQL editor
- Try running each CREATE TABLE separately

### Items not showing in rental form
- Add some inventory items first
- Make sure items have status "available"
- Refresh the page

---

## 🎓 Learning Path

Week 1: Basic Operations
- Add 10 inventory items
- Add 5 customers
- Create 3 rentals
- Practice pickups and returns

Week 2: Advanced Features
- Test date conflict detection
- Add alterations to rentals
- Track multiple payments
- Try language toggle

Week 3: Real World
- Import your existing inventory
- Set up for actual use
- Train your staff
- Deploy to production

---

## 💡 Pro Tips

1. **RFID Tags**: Use consistent naming (T001, T002...) for easy scanning
2. **Photos**: Always get customer ID photos for accountability
3. **Event Dates**: Always record event date - helps with follow-ups
4. **Early Pickup**: Set pickup 2 days before event for alterations
5. **Cleaning Time**: Schedule 1 day between rentals for cleaning
6. **Deposits**: Typical deposit is 50% of total rental

---

## 📞 Next Steps

Once comfortable with basics:
1. Add more inventory items
2. Customize for your business
3. Set up additional staff accounts
4. Deploy to production
5. Train your team

Need help? Check the full README.md for detailed documentation!