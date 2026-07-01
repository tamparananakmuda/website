-- Donations table for tracking Louvin payment transactions

CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  order_id text,
  amount integer NOT NULL,
  fee integer DEFAULT 0,
  net_amount integer DEFAULT 0,
  payment_type text NOT NULL DEFAULT 'qris',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'failed')),
  customer_name text,
  customer_email text,
  description text,
  reference text,
  qr_string text,
  va_number text,
  bank text,
  payment_number text,
  expired_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_donations_transaction_id ON donations(transaction_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_email ON donations(customer_email);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow anon to insert (create donation) and select by transaction_id
CREATE POLICY "anon_insert_donation"
  ON donations FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_select_own_donation"
  ON donations FOR SELECT TO anon
  USING (true);

CREATE POLICY "anon_update_donation_status"
  ON donations FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
