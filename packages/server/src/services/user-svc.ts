import { query } from "./db";
import { User } from "../models/user";

export async function initSchema() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      userid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nickname TEXT,
      color TEXT
    );
  `;
  await query(sql);
}

export async function index(): Promise<User[]> {
  const res = await query('SELECT * FROM users');
  // @ts-ignore
  return res.rows || [];
}

export async function get(userid: string): Promise<User | null> {
  const res = await query('SELECT * FROM users WHERE userid = $1 LIMIT 1', [userid]);
  // @ts-ignore
  const rows = res.rows || [];
  return rows.length ? rows[0] : null;
}

export async function create(t: User): Promise<void> {
  await query(`INSERT INTO users(userid, name, nickname, color)
    VALUES($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT (userid) DO UPDATE SET
      name = EXCLUDED.name,
      nickname = EXCLUDED.nickname,
      color = EXCLUDED.color
  `, [t.userid, t.name, t.nickname || null, t.color || null]);
}

export default { initSchema, index, get, create };
