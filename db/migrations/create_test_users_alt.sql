-- Alternative script to create test users for each role using Supabase's auth API
-- This script is an alternative to create_test_users.sql and may work better in some Supabase environments

-- Note: This script requires the supabase_admin role to run

-- Create a function to generate a test user
CREATE OR REPLACE FUNCTION create_test_user_via_api(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_user_type TEXT,
  p_is_admin BOOLEAN DEFAULT FALSE
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_result JSONB;
BEGIN
  -- Use Supabase's auth.create_user function
  SELECT id INTO v_user_id FROM auth.create_user(
    email := p_email,
    password := p_password,
    email_confirm := TRUE,
    data := jsonb_build_object('full_name', p_full_name, 'user_type', p_user_type)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create test users for each role
DO $$
DECLARE
  renter_id UUID;
  buyer_id UUID;
  owner_id UUID;
  admin_id UUID;
BEGIN
  -- Create a test Renter
  renter_id := create_test_user_via_api(
    'test.renter@example.com',
    'password123',
    'Test Renter',
    'renter'
  );

  -- Create a test Buyer
  buyer_id := create_test_user_via_api(
    'test.buyer@example.com',
    'password123',
    'Test Buyer',
    'buyer'
  );

  -- Create a test Owner
  owner_id := create_test_user_via_api(
    'test.owner@example.com',
    'password123',
    'Test Owner',
    'owner'
  );

  -- Create a test Admin (with Owner role)
  admin_id := create_test_user_via_api(
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

  -- Create a sample property for the owner
  IF owner_id IS NOT NULL THEN
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
  END IF;
END $$;

-- Clean up the function
DROP FUNCTION IF EXISTS create_test_user_via_api;
