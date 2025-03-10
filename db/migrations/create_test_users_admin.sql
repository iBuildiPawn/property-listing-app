-- Script to create test users using Supabase's auth admin functions
-- This script should be run with admin privileges in the Supabase SQL editor

-- Create test users
DO $$
DECLARE
  renter_id UUID;
  buyer_id UUID;
  v_owner_id UUID;  -- Changed variable name to avoid ambiguity
  admin_id UUID;
BEGIN
  -- Create a test Renter
  SELECT id INTO renter_id FROM auth.users WHERE email = 'test.renter@example.com';
  
  IF renter_id IS NULL THEN
    -- Use the correct auth function to create a user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'test.renter@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Test Renter", "user_type": "renter"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO renter_id;
    
    -- Create profile
    INSERT INTO public.profiles (
      id,
      full_name,
      email,
      user_type,
      is_admin,
      created_at,
      updated_at
    ) VALUES (
      renter_id,
      'Test Renter',
      'test.renter@example.com',
      'renter',
      FALSE,
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Created test Renter user: test.renter@example.com';
  ELSE
    RAISE NOTICE 'Renter user already exists with ID: %', renter_id;
  END IF;
  
  -- Create a test Buyer
  SELECT id INTO buyer_id FROM auth.users WHERE email = 'test.buyer@example.com';
  
  IF buyer_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'test.buyer@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Test Buyer", "user_type": "buyer"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO buyer_id;
    
    -- Create profile
    INSERT INTO public.profiles (
      id,
      full_name,
      email,
      user_type,
      is_admin,
      created_at,
      updated_at
    ) VALUES (
      buyer_id,
      'Test Buyer',
      'test.buyer@example.com',
      'buyer',
      FALSE,
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Created test Buyer user: test.buyer@example.com';
  ELSE
    RAISE NOTICE 'Buyer user already exists with ID: %', buyer_id;
  END IF;
  
  -- Create a test Owner
  SELECT id INTO v_owner_id FROM auth.users WHERE email = 'test.owner@example.com';
  
  IF v_owner_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'test.owner@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Test Owner", "user_type": "owner"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO v_owner_id;
    
    -- Create profile
    INSERT INTO public.profiles (
      id,
      full_name,
      email,
      user_type,
      is_admin,
      created_at,
      updated_at
    ) VALUES (
      v_owner_id,
      'Test Owner',
      'test.owner@example.com',
      'owner',
      FALSE,
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Created test Owner user: test.owner@example.com';
  ELSE
    RAISE NOTICE 'Owner user already exists with ID: %', v_owner_id;
  END IF;
  
  -- Create a test Admin
  SELECT id INTO admin_id FROM auth.users WHERE email = 'test.admin@example.com';
  
  IF admin_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'test.admin@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Test Admin", "user_type": "owner"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_id;
    
    -- Create profile
    INSERT INTO public.profiles (
      id,
      full_name,
      email,
      user_type,
      is_admin,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      'Test Admin',
      'test.admin@example.com',
      'owner',
      TRUE,
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Created test Admin user: test.admin@example.com';
  ELSE
    RAISE NOTICE 'Admin user already exists with ID: %', admin_id;
  END IF;

  -- Output success message
  RAISE NOTICE 'Test User Credentials:';
  RAISE NOTICE 'Test Renter: test.renter@example.com / password123';
  RAISE NOTICE 'Test Buyer: test.buyer@example.com / password123';
  RAISE NOTICE 'Test Owner: test.owner@example.com / password123';
  RAISE NOTICE 'Test Admin: test.admin@example.com / password123';

  -- Create a sample property for the owner
  IF v_owner_id IS NOT NULL THEN
    -- Check if the owner already has a property
    IF NOT EXISTS (SELECT 1 FROM properties WHERE owner_id = v_owner_id) THEN
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
        v_owner_id
      );

      RAISE NOTICE 'Created sample property for test owner';
    ELSE
      RAISE NOTICE 'Test owner already has properties';
    END IF;
  END IF;
END $$;
