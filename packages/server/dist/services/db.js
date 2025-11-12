"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPool = initPool;
exports.query = query;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DATABASE_URL, PG_USER, PG_PWD, PG_HOST = "localhost", PG_PORT = "5432", PG_DB = "testdb", } = process.env;
let pool = null;
function initPool() {
    if (pool)
        return pool;
    const connectionString = DATABASE_URL || (PG_USER && PG_PWD
        ? `postgresql://${encodeURIComponent(PG_USER)}:${encodeURIComponent(PG_PWD)}@${PG_HOST}:${PG_PORT}/${PG_DB}`
        : `postgresql://localhost:5432/${PG_DB}`);
    pool = new pg_1.Pool({ connectionString });
    pool.on('error', (err) => console.error('Postgres pool error', err));
    return pool;
}
async function query(text, params) {
    const p = initPool();
    const res = await p.query(text, params);
    return res;
}
exports.default = { initPool, query };
