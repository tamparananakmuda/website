import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

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

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__postgresClient = client;
}

const dbInstance: DbInstance = drizzle(client, { schema });

export const db = globalForDb.__drizzleDb ?? dbInstance;

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__drizzleDb = db;
}

export type Database = typeof db;
