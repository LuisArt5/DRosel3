-- ============================================================
-- Add brand column to inventory
-- Run this in your Supabase SQL Editor
-- ============================================================

ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS brand text;
