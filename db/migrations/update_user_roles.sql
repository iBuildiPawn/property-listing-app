-- Migration script to update user types to include 'owner' role
-- This script should be run to update the database schema

-- First, temporarily disable the constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Update existing user types to match new constraints
UPDATE profiles 
SET user_type = 
  CASE 
    WHEN user_type = 'investor' THEN 'owner'
    WHEN user_type = 'student' THEN 'renter'
    ELSE user_type
  END
WHERE user_type IN ('investor', 'student');

-- Add the new constraint with 'owner' included
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check 
  CHECK (user_type IN ('renter', 'buyer', 'owner'));

-- Update RLS policies for property owners
-- Check if the policy already exists and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'properties' 
    AND policyname = 'Owners can insert properties'
  ) THEN
    EXECUTE 'CREATE POLICY "Owners can insert properties" 
    ON properties FOR INSERT 
    WITH CHECK (
      auth.uid() IN (
        SELECT id FROM profiles 
        WHERE user_type = ''owner'' OR is_admin = TRUE
      )
    )';
    RAISE NOTICE 'Created new policy for property owners';
  ELSE
    RAISE NOTICE 'Policy for property owners already exists';
  END IF;
END $$;

-- Output a message
DO $$
BEGIN
  RAISE NOTICE 'User roles migration completed successfully';
  RAISE NOTICE 'Updated user types to: renter, buyer, owner';
  RAISE NOTICE 'Converted "investor" users to "owner" role';
  RAISE NOTICE 'Converted "student" users to "renter" role';
END $$;
