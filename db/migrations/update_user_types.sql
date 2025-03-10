-- Migration script to update user types and add admin functionality
-- This script should be run after updating the schema

-- Add is_admin column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;
    RAISE NOTICE 'Added is_admin column to profiles table';
  ELSE
    RAISE NOTICE 'is_admin column already exists in profiles table';
  END IF;
END $$;

-- Update existing user types to match new constraints
UPDATE profiles 
SET user_type = 
  CASE 
    WHEN user_type = 'investor' OR user_type = 'student' THEN 'buyer'
    ELSE user_type
  END
WHERE user_type IN ('investor', 'student');

-- Set the first user as admin for testing purposes
UPDATE profiles
SET is_admin = TRUE
WHERE id = (SELECT id FROM profiles ORDER BY created_at LIMIT 1);

-- Create RLS policy for admin access
CREATE POLICY IF NOT EXISTS "Admins can do anything"
ON properties
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

CREATE POLICY IF NOT EXISTS "Admins can do anything"
ON transportation_services
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

CREATE POLICY IF NOT EXISTS "Admins can view all conversations"
ON conversations
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

CREATE POLICY IF NOT EXISTS "Admins can view all user preferences"
ON user_preferences
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Update the check constraint for user_type
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check CHECK (user_type IN ('renter', 'buyer'));

-- Output a message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully';
END $$; 