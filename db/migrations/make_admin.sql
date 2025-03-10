-- Script to make a user an admin
-- Usage: Replace 'YOUR_EMAIL_HERE' with the email of the user you want to make an admin

-- Temporarily disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Update the user's profile to set is_admin to true
UPDATE profiles
SET is_admin = true
WHERE email = 'admin@test.com';

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Output the result
SELECT id, email, full_name, is_admin 
FROM profiles 
WHERE email = 'admin@test.com';
