-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. customers (no dependencies)
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  id_photo_url text,
  address text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);

-- 2. inventory (no dependencies)
CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  size text NOT NULL,
  rfid text UNIQUE,
  price numeric NOT NULL,
  status text NOT NULL DEFAULT 'available'::text CHECK (status = ANY (ARRAY['available'::text, 'rented'::text, 'cleaning'::text, 'maintenance'::text])),
  category text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT inventory_pkey PRIMARY KEY (id)
);

-- 3. profiles (depends on auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  role text NOT NULL DEFAULT 'viewer'::text CHECK (role = ANY (ARRAY['admin'::text, 'staff'::text, 'viewer'::text])),
  full_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- 4. rentals (depends on customers, auth.users)
CREATE TABLE IF NOT EXISTS public.rentals (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL,
  item_ids uuid[] NOT NULL DEFAULT '{}',
  total numeric NOT NULL,
  deposit numeric DEFAULT 0,
  paid_amount numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'reserved'::text CHECK (status = ANY (ARRAY['reserved'::text, 'picked_up'::text, 'returned'::text, 'cancelled'::text])),
  reservation_date date NOT NULL,
  pickup_date date NOT NULL,
  return_date date NOT NULL,
  actual_return_date date,
  event_date date,
  payment_method text DEFAULT 'cash'::text CHECK (payment_method = ANY (ARRAY['cash'::text, 'card'::text, 'check'::text, 'other'::text])),
  notes text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT rentals_pkey PRIMARY KEY (id),
  CONSTRAINT rentals_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT rentals_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- 5. alterations (depends on rentals)
CREATE TABLE IF NOT EXISTS public.alterations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  rental_id uuid NOT NULL,
  description text NOT NULL,
  cost numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'completed'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT alterations_pkey PRIMARY KEY (id),
  CONSTRAINT alterations_rental_id_fkey FOREIGN KEY (rental_id) REFERENCES public.rentals(id)
);

-- 6. payments (depends on rentals)
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  rental_id uuid NOT NULL,
  amount numeric NOT NULL,
  payment_method text NOT NULL CHECK (payment_method = ANY (ARRAY['cash'::text, 'card'::text, 'check'::text, 'other'::text])),
  payment_date date NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_rental_id_fkey FOREIGN KEY (rental_id) REFERENCES public.rentals(id)
);

-- 7. Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-photos', 'id-photos', true)
ON CONFLICT DO NOTHING;
