import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const {
  DATABASE_URL,
  PG_USER,
  PG_PWD,
  PG_HOST = "127.0.0.1",
  PG_PORT = "5432",
  PG_DB = "testdb",
} = process.env as Record<string, string | undefined>;

let pool: Pool | null = null;

export function initPool() {
  if (pool) return pool;

  // Support Render's typical env name `POSTGRES_URI` as well as DATABASE_URL
  const POSTGRES_URI = process.env.POSTGRES_URI;

  const connectionString = POSTGRES_URI || DATABASE_URL || (PG_USER && PG_PWD
    ? `postgresql://${encodeURIComponent(PG_USER)}:${encodeURIComponent(PG_PWD)}@${PG_HOST}:${PG_PORT}/${PG_DB}`
    : `postgresql://localhost:5432/${PG_DB}`);

  pool = new Pool({ connectionString });
  pool.on('error', (err: any) => console.error('Postgres pool error', err));
  return pool;
}

export async function query(text: string, params?: any[]) {
  const p = initPool();
  const res = await p.query(text, params);
  return res;
}

export default { initPool, query };
