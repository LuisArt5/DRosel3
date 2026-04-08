-- RLS policies for all core tables (stores already handled in migration-v8.sql)
-- Run this in your Supabase SQL Editor

-- customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can select customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update customers" ON public.customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete customers" ON public.customers FOR DELETE TO authenticated USING (true);

-- inventory
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can select inventory" ON public.inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert inventory" ON public.inventory FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update inventory" ON public.inventory FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete inventory" ON public.inventory FOR DELETE TO authenticated USING (true);

-- rentals
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can select rentals" ON public.rentals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert rentals" ON public.rentals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update rentals" ON public.rentals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete rentals" ON public.rentals FOR DELETE TO authenticated USING (true);

-- alterations
ALTER TABLE public.alterations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can select alterations" ON public.alterations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert alterations" ON public.alterations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update alterations" ON public.alterations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete alterations" ON public.alterations FOR DELETE TO authenticated USING (true);

-- payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can select payments" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update payments" ON public.payments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete payments" ON public.payments FOR DELETE TO authenticated USING (true);

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can select profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update profiles" ON public.profiles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete profiles" ON public.profiles FOR DELETE TO authenticated USING (true);

-- storage: id-photos bucket
CREATE POLICY "Authenticated users can upload id-photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'id-photos');
CREATE POLICY "Public can read id-photos" ON storage.objects FOR SELECT USING (bucket_id = 'id-photos');
