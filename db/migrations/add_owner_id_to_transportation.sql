-- Migration script to add owner_id field to transportation_services table
-- This allows tracking which user created each transportation service

-- Add owner_id column to transportation_services table
ALTER TABLE transportation_services ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_transportation_services_owner_id ON transportation_services(owner_id);

-- Update RLS policies for transportation_services
-- Drop existing policies if they exist
DO $$
BEGIN
  BEGIN
    DROP POLICY IF EXISTS "Transportation services are viewable by everyone" ON transportation_services;
    RAISE NOTICE 'Dropped existing policy on transportation_services';
  EXCEPTION
    WHEN undefined_object THEN
      RAISE NOTICE 'Policy does not exist, creating new one';
  END;
END $$;

-- Create new policies
CREATE POLICY "Transportation services are viewable by everyone" 
ON transportation_services FOR SELECT USING (true);

CREATE POLICY "Owners can insert their own transportation services" 
ON transportation_services FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND (profiles.user_type = 'owner' OR profiles.is_admin = true)
    )
  )
);

CREATE POLICY "Owners can update their own transportation services" 
ON transportation_services FOR UPDATE USING (
  auth.uid() = owner_id OR (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
);

CREATE POLICY "Owners can delete their own transportation services" 
ON transportation_services FOR DELETE USING (
  auth.uid() = owner_id OR (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
);

-- Output a message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully';
  RAISE NOTICE 'Added owner_id column to transportation_services table';
  RAISE NOTICE 'Created RLS policies for transportation_services';
END $$; 