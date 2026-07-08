-- Reader accounts: profiles linked to Supabase Auth users
-- Supabase Auth handles the users table, we just need a profile extension

CREATE TABLE IF NOT EXISTS reader_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  preferred_topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_active_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE reader_profiles ENABLE ROW LEVEL SECURITY;

-- Readers can see and edit their own profile
CREATE POLICY "reader_select_own_profile" ON reader_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "reader_update_own_profile" ON reader_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reader_insert_own_profile" ON reader_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.reader_profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(reader_id, post_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmark_select_own" ON bookmarks
  FOR SELECT TO authenticated
  USING (auth.uid() = reader_id);

CREATE POLICY "bookmark_insert_own" ON bookmarks
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reader_id);

CREATE POLICY "bookmark_delete_own" ON bookmarks
  FOR DELETE TO authenticated
  USING (auth.uid() = reader_id);

-- Reading history table
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMPTZ DEFAULT now(),
  progress INTEGER DEFAULT 0,
  UNIQUE(reader_id, post_id)
);

ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "history_select_own" ON reading_history
  FOR SELECT TO authenticated
  USING (auth.uid() = reader_id);

CREATE POLICY "history_upsert_own" ON reading_history
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reader_id);

CREATE POLICY "history_update_own" ON reading_history
  FOR UPDATE TO authenticated
  USING (auth.uid() = reader_id)
  WITH CHECK (auth.uid() = reader_id);

CREATE POLICY "history_delete_own" ON reading_history
  FOR DELETE TO authenticated
  USING (auth.uid() = reader_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_reader_id ON bookmarks(reader_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_reader_id ON reading_history(reader_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_post_id ON reading_history(post_id);
