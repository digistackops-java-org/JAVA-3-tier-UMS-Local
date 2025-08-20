-- Create database
CREATE DATABASE IF NOT EXISTS "user-account";

-- Create user (if not exists)
CREATE USER IF NOT EXISTS appuser WITH PASSWORD 'P@55Word';

-- Grant privileges on the DB
GRANT ALL PRIVILEGES ON DATABASE "user-account" TO appuser;

\connect "user-account";

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    salary NUMERIC(10,2) NOT NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON users TO appuser;
GRANT USAGE ON SCHEMA public TO appuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO appuser;
