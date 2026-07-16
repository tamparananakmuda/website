import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL or DATABASE_URL environment variable is required for Drizzle');
}

const globalForDb = globalThis as unknown as {
  __postgresClient?: ReturnType<typeof postgres>;
  __drizzleDb?: ReturnType<typeof drizzle>;
};

const client =
  globalForDb.__postgresClient ??
  postgres(connectionString, {
    prepare: false,
    max: 10,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__postgresClient = client;
}

export const db =
  globalForDb.__drizzleDb ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__drizzleDb = db;
}

export type Database = typeof db;
