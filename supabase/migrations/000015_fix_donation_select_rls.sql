-- Fix donation RLS: anon SELECT was effectively wide open
-- Old policy: USING (transaction_id IS NOT NULL) = true for all rows
-- New approach: remove anon SELECT entirely, status polling uses API route with service_role

DROP POLICY IF EXISTS "anon_select_donations" ON donations;

-- Only service_role can SELECT (API routes use service_role for status checks)
CREATE POLICY "service_select_donations" ON donations
  FOR SELECT TO service_role
  USING (true);
