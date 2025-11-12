-- scripts/init.sql
-- Create travelers table and insert sample row for PostgreSQL

CREATE TABLE IF NOT EXISTS travelers (
  userid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  home TEXT,
  airports TEXT[],
  avatar TEXT,
  color TEXT
);

INSERT INTO travelers (userid, name, nickname, home, airports, avatar, color)
VALUES ('u1', 'Example Traveler', 'Ex', 'Hometown', ARRAY['SFO','LAX'], NULL, 'blue')
ON CONFLICT DO NOTHING;
