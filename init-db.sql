-- Initialize WanGov database for local development
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The database 'wangov_id' is already created by POSTGRES_DB
-- Prisma will handle table creation via migrations
