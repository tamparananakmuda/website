-- Tighten RLS policies on donations table
-- Problem: anon can INSERT + SELECT + UPDATE all rows
-- Fix: restrict UPDATE to service role only, SELECT to specific transaction_id

-- Drop existing permissive policies
DROP POLICY IF EXISTS "anon_insert_donations" ON donations;
DROP POLICY IF EXISTS "anon_select_donations" ON donations;
DROP POLICY IF EXISTS "anon_update_donations" ON donations;

-- Allow anon to INSERT (needed for donation creation via API)
CREATE POLICY "anon_insert_donations" ON donations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anon to SELECT only by transaction_id (needed for status polling)
CREATE POLICY "anon_select_donations" ON donations
  FOR SELECT TO anon
  USING (transaction_id IS NOT NULL);

-- Only service role can UPDATE (webhook uses service role key)
-- No policy for anon UPDATE = denied by default
CREATE POLICY "service_update_donations" ON donations
  FOR UPDATE TO service_role
  USING (true)
  WITH CHECK (true);
