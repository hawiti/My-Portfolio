import { drizzle } from 'drizzle-orm/vercel-postgres';
import { createPool } from '@vercel/postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = createPool({
    connectionString: process.env.DATABASE_URL,
});

// Connect to Vercel Postgres
export const db