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

-- Drop existing policies if they exist
DO $$
BEGIN
  -- Drop policies for properties
  BEGIN
    DROP POLICY IF EXISTS "Admins can do anything" ON properties;
    RAISE NOTICE 'Dropped existing admin policy on properties';
  EXCEPTION
    WHEN undefined_object THEN
      RAISE NOTICE 'Admin policy on properties does not exist, creating new one';
  END;
  
  -- Drop policies for transportation_services
  BEGIN
    DROP POLICY IF EXISTS "Admins can do anything" ON transportation_services;
    RAISE NOTICE 'Dropped existing admin policy on transportation_services';
  EXCEPTION
    WHEN undefined_object THEN
      RAISE NOTICE 'Admin policy on transportation_services does not exist, creating new one';
  END;
  
  -- Drop policies for conversations
  BEGIN
    DROP POLICY IF EXISTS "Admins can view all conversations" ON conversations;
    RAISE NOTICE 'Dropped existing admin policy on conversations';
  EXCEPTION
    WHEN undefined_object THEN
      RAISE NOTICE 'Admin policy on conversations does not exist, creating new one';
  END;
  
  -- Drop policies for user_preferences
  BEGIN
    DROP POLICY IF EXISTS "Admins can view all user preferences" ON user_preferences;
    RAISE NOTICE 'Dropped existing admin policy on user_preferences';
  EXCEPTION
    WHEN undefined_object THEN
      RAISE NOTICE 'Admin policy on user_preferences does not exist, creating new one';
  END;
END $$;

-- Create RLS policy for admin access
CREATE POLICY "Admins can do anything"
ON properties
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

CREATE POLICY "Admins can do anything"
ON transportation_services
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

CREATE POLICY "Admins can view all conversations"
ON conversations
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

CREATE POLICY "Admins can view all user preferences"
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
