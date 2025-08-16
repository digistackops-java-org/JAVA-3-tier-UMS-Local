-- Create database objects for student app
-- Expecting database name: user-account (create the DB itself outside of Flyway)
-- Create enum for fees status
DO $$ BEGIN
  CREATE TYPE fees_status_enum AS ENUM ('Paid', 'Unpaid', 'Half-paid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  course TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  fees_status fees_status_enum NOT NULL DEFAULT 'Paid'
);
