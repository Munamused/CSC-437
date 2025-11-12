-- scripts/init.sql
-- Create users table and insert sample row for PostgreSQL

CREATE TABLE IF NOT EXISTS users (
  userid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  color TEXT
);

INSERT INTO users (userid, name, nickname, color)
VALUES ('u1', 'Example User', 'Ex', 'blue')
ON CONFLICT DO NOTHING;
