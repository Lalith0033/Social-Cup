import pg from 'pg';
import { loadConfig } from './config.js';

const { Pool } = pg;
const config = loadConfig();

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
});

export async function closeDatabase(): Promise<void> {
  await pool.end();
}
