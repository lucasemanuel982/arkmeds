import { Pool, QueryResult } from "pg";
import { env } from "../config/env";

const pool = new Pool({
  connectionString: env.database.url,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(
  text: string,
  params?: unknown[]
): Promise<QueryResult> {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function getPool(): Promise<Pool> {
  return pool;
}

export async function closePool(): Promise<void> {
  await pool.end();
}
