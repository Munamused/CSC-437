"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSchema = initSchema;
exports.index = index;
exports.get = get;
exports.create = create;
const db_1 = require("./db");
async function initSchema() {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      userid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nickname TEXT,
      color TEXT
    );
  `;
    await (0, db_1.query)(sql);
}
async function index() {
    const res = await (0, db_1.query)('SELECT * FROM users');
    // @ts-ignore
    return res.rows || [];
}
async function get(userid) {
    const res = await (0, db_1.query)('SELECT * FROM users WHERE userid = $1 LIMIT 1', [userid]);
    // @ts-ignore
    const rows = res.rows || [];
    return rows.length ? rows[0] : null;
}
async function create(t) {
    await (0, db_1.query)(`INSERT INTO users(userid, name, nickname, color)
    VALUES($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT (userid) DO UPDATE SET
      name = EXCLUDED.name,
      nickname = EXCLUDED.nickname,
      color = EXCLUDED.color
  `, [t.userid, t.name, t.nickname || null, t.color || null]);
}
exports.default = { initSchema, index, get, create };
