-- ============================================================
-- Add RFC and CURP columns to stores table
-- Run this in your Supabase SQL Editor
-- ============================================================

ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS rfc text;

ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS curp text;
