import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import type { Logger } from 'drizzle-orm';

const isDev = process.env.NODE_ENV !== 'production';

// NOTE: Drizzle's Logger.logQuery fires BEFORE query execution — cannot measure duration here.
// In development: logs all queries for debugging.
// In production: silent (rely on Sentry + Vercel query monitoring for slow queries).
const queryLogger: Logger = {
  logQuery(query: string, _params: unknown[]) {
    if (isDev) {
      console.log(`[db] ${query.slice(0, 150)}`);
    }
  },
};

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL or DATABASE_URL environment variable is required for Drizzle');
}

type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __postgresClient?: ReturnType<typeof postgres>;
  __drizzleDb?: DbInstance;
};

const client =
  globalForDb.__postgresClient ??
  postgres(connectionString, {
    prepare: false,
    max: 10,
  });

if (isDev) {
  globalForDb.__postgresClient = client;
}

const dbInstance: DbInstance = drizzle(client, {
  schema,
  logger: queryLogger,
});

export const db = globalForDb.__drizzleDb ?? dbInstance;

if (isDev) {
  globalForDb.__drizzleDb = db;
}

export type Database = typeof db;

/**
 * Returns the correct database connection based on context.
 *
 * POOLED (default, pooled = true):
 *   - Gunakan untuk SEMUA query di runtime app (Server Components, API routes, Middleware)
 *   - Menggunakan POSTGRES_URL (pgBouncer pooling)
 *   - Max 10 connections per serverless instance
 *   - Contoh: getPublishedPosts(), getPostBySlug(), dll.
 *
 * NON-POOLED (pooled = false):
 *   - Gunakan hanya di scripts & one-off jobs yang berjalan lama
 *   - Menggunakan POSTGRES_URL_NON_POOLING (direct TCP ke Postgres)
 *   - Diperlukan untuk DDL (CREATE TABLE, ALTER TABLE) dan long-running transactions
 *   - Contoh: scripts/generate-all-og.ts, scripts/migrate-*.ts
 *   - JANGAN gunakan di Server Components atau API routes (exhausts connection pool)
 *
 * @param pooled - true untuk pooled (default), false untuk direct non-pooled
 */
export function getDbConnection(pooled = true): DbInstance {
  if (pooled) return db;

  const nonPoolingUrl = process.env.POSTGRES_URL_NON_POOLING;
  if (!nonPoolingUrl) {
    console.warn('[db] POSTGRES_URL_NON_POOLING not set, falling back to pooled connection');
    return db;
  }

  const directClient = postgres(nonPoolingUrl, { prepare: false, max: 1 });
  return drizzle(directClient, { schema });
}
