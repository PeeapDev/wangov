-- Initialize WanGov-ID Database
-- This script sets up the initial database configuration

-- Create extensions that might be needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Create a dedicated schema for audit logs (optional)
-- CREATE SCHEMA IF NOT EXISTS audit;

-- Initial database setup complete
SELECT 'WanGov-ID Database initialized successfully' as status;
