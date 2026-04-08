-- ============================================================
-- Tuxedo Rental App v8 Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create stores table
CREATE TABLE IF NOT EXISTS public.stores (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text,
  phone text,
  logo_url text,
  terms_and_conditions text DEFAULT 'Standard rental terms and conditions apply. All items must be returned in original condition by the agreed return date. Late returns will incur a daily fee. Customer is responsible for any damage or loss of rented items. A cleaning fee may be assessed upon return.',
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT stores_pkey PRIMARY KEY (id)
);

-- 2. Add store_id to inventory
ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES public.stores(id);

-- 3. Add store_id to rentals
ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES public.stores(id);

-- 4. Extend customers table
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS address text;

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS measurements jsonb DEFAULT '{}';

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS notes text;

-- 5. Add default store to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES public.stores(id);

-- 6. Enable RLS on stores
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- 7. RLS policy: authenticated users can read stores
CREATE POLICY "Authenticated users can read stores"
  ON public.stores FOR SELECT
  TO authenticated
  USING (true);

-- 8. RLS policy: only admins can manage stores (via app-level check)
CREATE POLICY "Authenticated users can insert stores"
  ON public.stores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stores"
  ON public.stores FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete stores"
  ON public.stores FOR DELETE
  TO authenticated
  USING (true);

-- 9. Create store-logos storage bucket (run in Supabase dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('store-logos', 'store-logos', true)
-- ON CONFLICT DO NOTHING;

-- ============================================================
-- Optional: insert a default store so existing data isn't orphaned
-- ============================================================
-- INSERT INTO public.stores (name, address, phone)
-- VALUES ('Main Store', '123 Main St', '555-0100')
-- RETURNING id;
-- Then update existing inventory/rentals:
-- UPDATE public.inventory SET store_id = '<id from above>';
-- UPDATE public.rentals SET store_id = '<id from above>';
