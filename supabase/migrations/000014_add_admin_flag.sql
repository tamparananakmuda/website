-- Add is_admin column to reader_profiles for admin access control
ALTER TABLE reader_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Only service role can manage admin flag
CREATE POLICY "service_update_admin_flag" ON reader_profiles
  FOR UPDATE TO service_role
  USING (true)
  WITH CHECK (true);
