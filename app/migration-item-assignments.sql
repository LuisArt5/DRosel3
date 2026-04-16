-- ============================================================
-- Add item_assignments to rentals (per-person item mapping)
-- Run this in your Supabase SQL Editor
-- ============================================================

ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS item_assignments jsonb DEFAULT '{}';
