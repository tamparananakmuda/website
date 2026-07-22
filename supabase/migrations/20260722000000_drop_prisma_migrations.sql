-- Drop orphaned Prisma ORM internal table
-- Project has fully migrated to Drizzle ORM; this table is unused
-- Fixes Supabase security lint: RLS not enabled on public._prisma_migrations

DROP TABLE IF EXISTS "_prisma_migrations";
