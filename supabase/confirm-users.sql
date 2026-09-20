-- ============================================================================
-- Supabase Fix: Instantly Confirm All Users Without Waiting for Email
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ylgkctistrzwvyxrivjd/sql
-- ============================================================================

UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;
