# Tuxedo Rental Admin System v7

A comprehensive tuxedo rental management system with user authentication, real-time inventory tracking, payment management, alterations tracking, and bilingual support (English/Spanish).

## Features

### Core Features
- ✅ **User Authentication** - Secure login with role-based access (Admin, Staff, Viewer)
- ✅ **Customer Management** - Track customer info with ID photo uploads
- ✅ **Inventory Management** - RFID tracking, status management, availability checking
- ✅ **Rental Management** - Full rental lifecycle from reservation to return
- ✅ **Date Conflict Detection** - Automatic checking for overlapping reservations
- ✅ **Event Date Tracking** - Separate event date from pickup/return dates
- ✅ **Payment Tracking** - Multiple payment methods, deposit and balance tracking
- ✅ **Alterations Management** - Track alterations with costs and status
- ✅ **Bilingual Interface** - Toggle between English and Spanish
- ✅ **Dashboard** - Today's pickups, returns, and overdue items
- ✅ **Search Functionality** - Search customers and inventory

### Payment Features
- Multiple payment methods (Cash, Card, Check, Other)
- Deposit tracking
- Balance calculation with alterations
- Payment history per rental

### Date Management
- Reservation date
- Pickup date
- Return date
- Event date (optional)
- Automatic conflict detection

### Alterations Tracking
- Add multiple alterations per rental
- Track alteration costs
- Monitor alteration status (Pending, In Progress, Completed)
- Automatic balance updates

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to SQL Editor in your Supabase dashboard
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Click "Run" to execute the SQL script
6. Go to Authentication > Users and create your first user
7. Go to Table Editor > profiles and insert a row:
   ```
   id: [your user's UUID from Authentication]
   role: admin
   ```

### 2. Storage Setup

The SQL script automatically creates the storage bucket. Verify:
1. Go to Storage in Supabase dashboard
2. Confirm "id-photos" bucket exists
3. Policies should be set automatically by the SQL script

### 3. Environment Variables

1. Copy `.env.local.template` to `.env.local`
2. Get your Supabase credentials:
   - Go to Project Settings > API
   - Copy the Project URL
   - Copy the anon/public key
3. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Database Tables

### profiles
- User roles and permissions
- Linked to Supabase auth.users

### customers
- Customer information
- Phone, email, ID photos
- Address information

### inventory
- Tuxedo and suit items
- RFID tracking
- Size, price, status
- Categories (tuxedo, suit, shirt, accessory, shoes)

### rentals
- Complete rental information
- Customer reference
- Item IDs (array of inventory items)
- All dates (reservation, pickup, return, event)
- Payment information
- Status tracking

### alterations
- Linked to rentals
- Description and cost
- Status tracking

### payments
- Payment history
- Multiple payment methods
- Linked to rentals

## User Roles

### Admin
- Full access to all features
- Can delete records
- Can manage users
- Can edit all settings

### Staff
- Can view, create, and edit
- Cannot delete records
- Cannot manage users

### Viewer
- Read-only access
- Can view all information
- Cannot make changes

## Usage Guide

### Adding a Customer
1. Navigate to Customers tab
2. Click "ADD CUSTOMER"
3. Fill in required information
4. Upload ID photo (optional)
5. Click SAVE

### Creating a Rental
1. Navigate to Rentals tab
2. Click "NEW RENTAL"
3. Select customer
4. Choose items (checkbox selection)
5. Set event date (optional)
6. Set pickup and return dates
7. Select payment method
8. Enter deposit amount
9. Add notes if needed
10. Click SAVE

The system will automatically:
- Calculate total based on selected items
- Check for date conflicts
- Warn if items are already booked

### Adding Alterations
1. Edit an existing rental
2. Scroll to Alterations section
3. Enter alteration description
4. Enter cost
5. Click "Add Alteration"

Alterations automatically update the rental balance.

### Processing Pickup
1. Go to Dashboard
2. Find rental in "TODAY'S PICKUPS"
3. Click "MARK PICKED UP"

This automatically:
- Changes rental status to "picked_up"
- Changes item status to "rented"

### Processing Return
1. Go to Dashboard
2. Find rental in "TODAY'S RETURNS" or "OVERDUE RETURNS"
3. Click "CHECK IN NOW"

This automatically:
- Changes rental status to "returned"
- Sets actual return date
- Changes item status to "cleaning"

### Language Toggle
Click the globe icon in the top right to switch between English and Spanish.

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
6. Click "Deploy"

### Important: Environment Variables in Vercel

After deploying, you MUST add your environment variables:
1. Go to Project Settings > Environment Variables
2. Add both variables
3. Redeploy if you added them after initial deployment

## Troubleshooting

### "Missing Supabase environment variables" error
- Check that .env.local exists and has correct values
- For Vercel, check Project Settings > Environment Variables
- Redeploy after adding variables

### Login not working
- Verify user exists in Supabase Authentication
- Check that profile record exists with correct role
- Verify Supabase URL and key are correct

### Images not uploading
- Check Storage > id-photos bucket exists
- Verify storage policies are set (run SQL script again if needed)
- Check browser console for errors

### Date conflicts not working
- Verify rentals have correct pickup and return dates
- Check that item_ids are stored as UUID arrays
- Inspect browser console for errors

### Items not showing in rental form
- Check inventory items have status "available"
- Verify inventory table has items
- Check that items have valid UUIDs

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Only authenticated users can access data
- Admins can delete, staff can edit, viewers can only read
- Storage policies restrict uploads to authenticated users
- ID photos are publicly viewable but only uploadable by authenticated users

## Customization

### Adding New Inventory Categories
Edit the inventory form in `app/page.js` and add category options.

### Changing Color Scheme
The app uses Tailwind CSS. Modify gradient colors in the className props.

### Adding New Payment Methods
1. Update database check constraint in `supabase-schema.sql`
2. Add translation in translations object
3. Update payment method select in modal

### Adding More Languages
Add new language object in translations at top of `app/page.js`:

```javascript
const translations = {
  en: { ... },
  es: { ... },
  fr: { ... }  // Add French
};
```

## Support

For issues or questions:
1. Check the browser console for errors
2. Check Supabase logs in dashboard
3. Verify all environment variables are set
4. Check that database schema is properly created

## License

This project is private and proprietary.

## Version History

### v7.0 (Current)
- Added user authentication
- Added language toggle (EN/ES)
- Added payment method tracking
- Added date conflict checking
- Added event date separate from pickup/return
- Added full alterations tracking
- Added ability to edit rentals
- Added payment history
- Added balance calculation
- Enhanced UI with better forms
- Added comprehensive search

### Previous Versions
- v6.0: Initial multi-tab interface
- v5.0: Basic rental tracking