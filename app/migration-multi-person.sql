-- ============================================================
-- Add additional_customer_ids to rentals (multi-person support)
-- Run this in your Supabase SQL Editor
-- ============================================================

ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS additional_customer_ids uuid[] DEFAULT '{}';
