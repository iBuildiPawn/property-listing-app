-- SQL script to insert Kuwait-specific properties into the Supabase database
-- This script should be run after the initial seed_database.sql script

-- Create a temporary variable to store a valid user ID
DO $$
DECLARE
  valid_user_id UUID;
BEGIN
  -- Try to get a user ID from the profiles table
  SELECT id INTO valid_user_id FROM profiles LIMIT 1;
  
  -- If no user ID is found, raise a notice
  IF valid_user_id IS NULL THEN
    RAISE NOTICE 'No valid user ID found in profiles table. Using a default UUID.';
    valid_user_id := '00000000-0000-0000-0000-000000000000'::UUID;
  END IF;
  
  -- Store the user ID in a temporary table for use in the INSERT statements
  CREATE TEMP TABLE temp_valid_user_id AS SELECT valid_user_id AS user_id;
END $$;

-- Insert Kuwait-specific properties
INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Spacious 1 Bedroom Townhouse for Sale in Mangaf',
  'Magnificent 1 bedroom townhouse for sale in the prestigious area of Mangaf, Kuwait. This stunning property offers 1 bathroom and a generous 321 square meters of living space. Features include Covered Parking, Elevator, Built-in Wardrobes, Equipped Kitchen, Balcony, Maid''s Room, Sea View, Children''s Play Area. An exceptional opportunity to own a premium property in one of Kuwait''s most sought-after neighborhoods.',
  454622,
  'Mangaf, Kuwait',
  'townhouse',
  1,
  1,
  321,
  ARRAY['/storage/v1/object/public/property_images/townhouse_1_1.jpg', '/storage/v1/object/public/property_images/townhouse_1_2.jpg', '/storage/v1/object/public/property_images/townhouse_1_3.jpg'],
  ARRAY['Covered Parking', 'Elevator', 'Built-in Wardrobes', 'Equipped Kitchen', 'Balcony', 'Maid''s Room', 'Sea View', 'Children''s Play Area'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Luxurious 3 Bedroom Duplex for Rent in Salmiya',
  'Beautiful 3 bedroom duplex available for rent in Salmiya, Kuwait. This modern duplex features 3 bathrooms and spans 250 square meters of living space. Enjoy amenities including Central Air Conditioning, Swimming Pool, Gym, Security System, Marble Flooring, Equipped Kitchen, Furnished. Perfect for families or professionals looking for a comfortable living space in a prime Kuwait location.',
  1200,
  'Salmiya, Kuwait',
  'house',
  3,
  3,
  250,
  ARRAY['/storage/v1/object/public/property_images/duplex_2_1.jpg', '/storage/v1/object/public/property_images/duplex_2_3.jpg'],
  ARRAY['Central Air Conditioning', 'Swimming Pool', 'Gym', 'Security System', 'Marble Flooring', 'Equipped Kitchen', 'Furnished'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Luxurious 4 Bedroom Penthouse for Rent in Kuwait City',
  'Beautiful 4 bedroom penthouse available for rent in Kuwait City, Kuwait. This modern penthouse features 4 bathrooms and spans 350 square meters of living space. Enjoy amenities including Sea View, Central Air Conditioning, Swimming Pool, Gym, Security System, Concierge Service, Equipped Kitchen. Perfect for families or professionals looking for a comfortable living space in a prime Kuwait location.',
  2500,
  'Kuwait City, Kuwait',
  'condo',
  4,
  4,
  350,
  ARRAY['/storage/v1/object/public/property_images/penthouse_3_1.jpg', '/storage/v1/object/public/property_images/penthouse_3_2.jpg'],
  ARRAY['Sea View', 'Central Air Conditioning', 'Swimming Pool', 'Gym', 'Security System', 'Concierge Service', 'Equipped Kitchen'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Spacious 5 Bedroom Villa for Sale in Fintas',
  'Magnificent 5 bedroom villa for sale in the prestigious area of Fintas, Kuwait. This stunning property offers 5 bathrooms and a generous 500 square meters of living space. Features include Swimming Pool, Garden, Maid''s Room, Security System, Marble Flooring, Covered Parking, Equipped Kitchen. An exceptional opportunity to own a premium property in one of Kuwait''s most sought-after neighborhoods.',
  750000,
  'Fintas, Kuwait',
  'house',
  5,
  5,
  500,
  ARRAY['/storage/v1/object/public/property_images/villa_4_1.jpg', '/storage/v1/object/public/property_images/villa_4_2.jpg'],
  ARRAY['Swimming Pool', 'Garden', 'Maid''s Room', 'Security System', 'Marble Flooring', 'Covered Parking', 'Equipped Kitchen'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Luxurious 2 Bedroom Chalet for Rent in Mangaf',
  'Beautiful 2 bedroom chalet available for rent in Mangaf, Kuwait. This modern chalet features 2 bathrooms and spans 180 square meters of living space. Enjoy amenities including Sea View, Swimming Pool, Security System, Equipped Kitchen, Furnished, Central Air Conditioning. Perfect for families or professionals looking for a comfortable living space in a prime Kuwait location.',
  1100,
  'Mangaf, Kuwait',
  'house',
  2,
  2,
  180,
  ARRAY['/storage/v1/object/public/property_images/chalet_5_1.jpg', '/storage/v1/object/public/property_images/chalet_5_2.jpg', '/storage/v1/object/public/property_images/chalet_5_3.jpg'],
  ARRAY['Sea View', 'Swimming Pool', 'Security System', 'Equipped Kitchen', 'Furnished', 'Central Air Conditioning'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Spacious 3 Bedroom Chalet for Sale in Fahaheel',
  'Magnificent 3 bedroom chalet for sale in the prestigious area of Fahaheel, Kuwait. This stunning property offers 3 bathrooms and a generous 280 square meters of living space. Features include Sea View, Swimming Pool, Garden, Security System, Marble Flooring, Equipped Kitchen, Covered Parking. An exceptional opportunity to own a premium property in one of Kuwait''s most sought-after neighborhoods.',
  380000,
  'Fahaheel, Kuwait',
  'house',
  3,
  3,
  280,
  ARRAY['/storage/v1/object/public/property_images/chalet_6_1.jpg', '/storage/v1/object/public/property_images/chalet_6_2.jpg', '/storage/v1/object/public/property_images/chalet_6_3.jpg'],
  ARRAY['Sea View', 'Swimming Pool', 'Garden', 'Security System', 'Marble Flooring', 'Equipped Kitchen', 'Covered Parking'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Spacious 4 Bedroom Townhouse for Sale in Jahra',
  'Magnificent 4 bedroom townhouse for sale in the prestigious area of Jahra, Kuwait. This stunning property offers 4 bathrooms and a generous 320 square meters of living space. Features include Garden, Security System, Marble Flooring, Covered Parking, Maid''s Room, Equipped Kitchen, Built-in Wardrobes. An exceptional opportunity to own a premium property in one of Kuwait''s most sought-after neighborhoods.',
  420000,
  'Jahra, Kuwait',
  'townhouse',
  4,
  4,
  320,
  ARRAY['/storage/v1/object/public/property_images/townhouse_7_1.jpg', '/storage/v1/object/public/property_images/townhouse_7_2.jpg', '/storage/v1/object/public/property_images/townhouse_7_3.jpg'],
  ARRAY['Garden', 'Security System', 'Marble Flooring', 'Covered Parking', 'Maid''s Room', 'Equipped Kitchen', 'Built-in Wardrobes'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Luxurious 2 Bedroom Penthouse for Rent in Sabah Al-Salem',
  'Beautiful 2 bedroom penthouse available for rent in Sabah Al-Salem, Kuwait. This modern penthouse features 2 bathrooms and spans 200 square meters of living space. Enjoy amenities including Sea View, Central Air Conditioning, Gym, Security System, Equipped Kitchen, Furnished, Balcony. Perfect for families or professionals looking for a comfortable living space in a prime Kuwait location.',
  1300,
  'Sabah Al-Salem, Kuwait',
  'condo',
  2,
  2,
  200,
  ARRAY['/storage/v1/object/public/property_images/penthouse_8_1.jpg', '/storage/v1/object/public/property_images/penthouse_8_2.jpg'],
  ARRAY['Sea View', 'Central Air Conditioning', 'Gym', 'Security System', 'Equipped Kitchen', 'Furnished', 'Balcony'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Spacious 5 Bedroom Villa for Sale in Bayan',
  'Magnificent 5 bedroom villa for sale in the prestigious area of Bayan, Kuwait. This stunning property offers 6 bathrooms and a generous 550 square meters of living space. Features include Swimming Pool, Garden, Maid''s Room, Security System, Marble Flooring, Covered Parking, Equipped Kitchen, Elevator. An exceptional opportunity to own a premium property in one of Kuwait''s most sought-after neighborhoods.',
  850000,
  'Bayan, Kuwait',
  'house',
  5,
  6,
  550,
  ARRAY['/storage/v1/object/public/property_images/villa_9_1.jpg', '/storage/v1/object/public/property_images/villa_9_2.jpg'],
  ARRAY['Swimming Pool', 'Garden', 'Maid''s Room', 'Security System', 'Marble Flooring', 'Covered Parking', 'Equipped Kitchen', 'Elevator'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, images, amenities, created_at, updated_at, owner_id)
SELECT
  'Spacious 3 Bedroom Duplex for Sale in Mishref',
  'Magnificent 3 bedroom duplex for sale in the prestigious area of Mishref, Kuwait. This stunning property offers 3 bathrooms and a generous 300 square meters of living space. Features include Garden, Security System, Marble Flooring, Covered Parking, Maid''s Room, Equipped Kitchen, Built-in Wardrobes, Central Air Conditioning. An exceptional opportunity to own a premium property in one of Kuwait''s most sought-after neighborhoods.',
  400000,
  'Mishref, Kuwait',
  'house',
  3,
  3,
  300,
  ARRAY['/storage/v1/object/public/property_images/duplex_10_1.jpg', '/storage/v1/object/public/property_images/duplex_10_3.jpg'],
  ARRAY['Garden', 'Security System', 'Marble Flooring', 'Covered Parking', 'Maid''s Room', 'Equipped Kitchen', 'Built-in Wardrobes', 'Central Air Conditioning'],
  NOW(),
  NOW(),
  user_id
FROM temp_valid_user_id;

-- Drop the temporary table
DROP TABLE IF EXISTS temp_valid_user_id;

-- Note: After running this script, you'll need to upload the corresponding images to your Supabase storage bucket
-- The images should be uploaded to the 'property_images' bucket with the same filenames as specified in the arrays above 