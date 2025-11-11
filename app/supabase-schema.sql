-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.alterations (
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
CREATE TABLE public.customers (
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
CREATE TABLE public.inventory (
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
CREATE TABLE public.payments (
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
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  role text NOT NULL DEFAULT 'viewer'::text CHECK (role = ANY (ARRAY['admin'::text, 'staff'::text, 'viewer'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  full_name text,
  avatar_url text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.rentals (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL,
  item_ids ARRAY NOT NULL,
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