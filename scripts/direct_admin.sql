-- Direct Admin SQL Script
-- This script directly makes a user an admin by their email
-- Replace 'YOUR_EMAIL_HERE' with your actual email address

-- Disable RLS for the operation
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Update the user's profile to set is_admin to true
UPDATE profiles
SET is_admin = true
WHERE email = 'admin@test.com';

-- Verify the update
SELECT id, email, full_name, is_admin 
FROM profiles 
WHERE email = 'admin@test.com';

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; 