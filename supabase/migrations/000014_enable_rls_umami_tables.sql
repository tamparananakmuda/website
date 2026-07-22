-- Enable RLS on all Umami analytics tables (defense-in-depth)
-- TAM app code does not query these tables (verified: zero references in .ts/.tsx)
-- Umami backend uses service role / direct DB connection (bypasses RLS)
-- This blocks anon/authenticated access via PostgREST API

ALTER TABLE heatmap_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE website ENABLE ROW LEVEL SECURITY;
ALTER TABLE report ENABLE ROW LEVEL SECURITY;
ALTER TABLE segment ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE link ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel ENABLE ROW LEVEL SECURITY;
ALTER TABLE share ENABLE ROW LEVEL SECURITY;
ALTER TABLE _prisma_migrations ENABLE ROW LEVEL SECURITY;

-- Explicit service_role policies (best practice, follows existing TAM pattern)
CREATE POLICY "service_all_event_data" ON event_data FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_session" ON session FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_session_data" ON session_data FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_website_event" ON website_event FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_website" ON website FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_report" ON report FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_revenue" ON revenue FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_team" ON team FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_team_user" ON team_user FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_user" ON "user" FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_segment" ON segment FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_link" ON link FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_pixel" ON pixel FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_share" ON share FOR ALL TO service_role USING (true) WITH CHECK (true);
