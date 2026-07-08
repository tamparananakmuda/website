-- Sprint 4: Own the Revenue
-- 1. Donation goals + donor wall
-- 2. Sponsored content support

-- Add columns to donations for donor wall and recurring support
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS message TEXT,
  ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS recurring_interval TEXT DEFAULT NULL CHECK (recurring_interval IN ('monthly', 'quarterly', 'yearly'));

-- Donation goals table (monthly targets)
CREATE TABLE IF NOT EXISTS donation_goals (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL DEFAULT 'Donasi Bulanan',
  target_amount BIGINT NOT NULL,
  current_amount BIGINT NOT NULL DEFAULT 0,
  period_month INTEGER NOT NULL,
  period_year INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE donation_goals ENABLE ROW LEVEL SECURITY;

-- Anyone can read active donation goals
CREATE POLICY "anon_read_donation_goals" ON donation_goals
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Only service role can manage goals
CREATE POLICY "service_manage_donation_goals" ON donation_goals
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Unique constraint: one active goal per month/year
CREATE UNIQUE INDEX IF NOT EXISTS idx_donation_goals_period
  ON donation_goals (period_month, period_year)
  WHERE is_active = true;

-- Add sponsored content columns to posts
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sponsor_name TEXT,
  ADD COLUMN IF NOT EXISTS sponsor_url TEXT,
  ADD COLUMN IF NOT EXISTS sponsor_disclosure TEXT;

-- Update existing donations RLS to allow reading settled donations for donor wall
-- (only non-anonymous, settled donations)
CREATE POLICY "anon_read_donor_wall" ON donations
  FOR SELECT TO anon, authenticated
  USING (status = 'settled' AND is_anonymous = false);

-- Function to recalculate goal progress
CREATE OR REPLACE FUNCTION update_donation_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE donation_goals
  SET
    current_amount = (
      SELECT COALESCE(SUM(net_amount), 0)
      FROM donations
      WHERE status = 'settled'
        AND EXTRACT(MONTH FROM updated_at) = period_month
        AND EXTRACT(YEAR FROM updated_at) = period_year
    ),
    updated_at = now()
  WHERE is_active = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update goal when donation status changes
DROP TRIGGER IF EXISTS trigger_update_donation_goal ON donations;
CREATE TRIGGER trigger_update_donation_goal
  AFTER INSERT OR UPDATE OF status ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_donation_goal_progress();
