-- Script to create test users for each role: Renter, Buyer, and Owner
-- This script should be run after setting up the database schema

-- Function to create a test user with a specific role
CREATE OR REPLACE FUNCTION create_test_user(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_user_type TEXT,
  p_is_admin BOOLEAN DEFAULT FALSE
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Generate a UUID for the user
  v_user_id := gen_random_uuid();

  -- Insert user into auth.users table
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    json_build_object('full_name', p_full_name, 'user_type', p_user_type),
    NOW(),
    NOW()
  );

  -- Insert user profile
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    user_type,
    is_admin,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    p_full_name,
    p_email,
    p_user_type,
    p_is_admin,
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Created test user: % (%) with role: %', p_full_name, p_email, p_user_type;
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create test users for each role
DO $$
DECLARE
  renter_id UUID;
  buyer_id UUID;
  owner_id UUID;
BEGIN
  -- Create a test Renter
  renter_id := create_test_user(
    'test.renter@example.com',
    'password123',
    'Test Renter',
    'renter'
  );

  -- Create a test Buyer
  buyer_id := create_test_user(
    'test.buyer@example.com',
    'password123',
    'Test Buyer',
    'buyer'
  );

  -- Create a test Owner
  owner_id := create_test_user(
    'test.owner@example.com',
    'password123',
    'Test Owner',
    'owner'
  );

  -- Create a test Admin (with Owner role)
  PERFORM create_test_user(
    'test.admin@example.com',
    'password123',
    'Test Admin',
    'owner',
    TRUE
  );

  -- Output success message
  RAISE NOTICE 'Successfully created test users for all roles';
  RAISE NOTICE 'Test Renter: test.renter@example.com / password123';
  RAISE NOTICE 'Test Buyer: test.buyer@example.com / password123';
  RAISE NOTICE 'Test Owner: test.owner@example.com / password123';
  RAISE NOTICE 'Test Admin: test.admin@example.com / password123';
END $$;

-- Create some sample properties for the owner
DO $$
DECLARE
  owner_id UUID;
BEGIN
  -- Get the owner's ID
  SELECT id INTO owner_id FROM profiles WHERE email = 'test.owner@example.com';

  -- Create a sample property for the owner
  INSERT INTO properties (
    title,
    description,
    price,
    location,
    property_type,
    bedrooms,
    bathrooms,
    size,
    amenities,
    images,
    owner_id
  ) VALUES (
    'Test Owner Property',
    'A beautiful property listed by our test owner',
    250000,
    'Test Location, Kuwait City',
    'apartment',
    2,
    2,
    120,
    ARRAY['parking', 'pool', 'gym'],
    ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
    owner_id
  );

  RAISE NOTICE 'Created sample property for test owner';
END $$;

-- Clean up the function
DROP FUNCTION IF EXISTS create_test_user;
