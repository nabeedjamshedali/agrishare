-- Make phone and location nullable in users table
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE users ALTER COLUMN location DROP NOT NULL;
