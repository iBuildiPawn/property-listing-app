-- Seed Database Script
-- This script populates the database with sample data for testing

-- Temporarily disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;

-- Create a temporary table to store user IDs
CREATE TEMP TABLE temp_user_ids (
  index INT PRIMARY KEY,
  user_id UUID UNIQUE  -- Add UNIQUE constraint to ensure each user ID is only used once
);

-- Get existing user IDs from auth.users table
-- This will populate the temp table with up to 4 user IDs from the auth.users table
DO $$
DECLARE
  user_count INT;
  user_record RECORD;
  i INT := 1;
BEGIN
  -- Check how many users exist
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  -- If no users exist, raise a notice
  IF user_count = 0 THEN
    RAISE NOTICE 'No users found in auth.users table. Please create users before running this script.';
    RETURN;
  END IF;
  
  -- Get up to 4 user IDs
  FOR user_record IN SELECT id FROM auth.users LIMIT 4
  LOOP
    INSERT INTO temp_user_ids (index, user_id) VALUES (i, user_record.id);
    i := i + 1;
  END LOOP;
  
  -- If we have fewer than 4 users, create placeholder UUIDs for the remaining indexes
  WHILE i <= 4 LOOP
    INSERT INTO temp_user_ids (index, user_id) VALUES (i, gen_random_uuid());
    i := i + 1;
  END LOOP;
  
  RAISE NOTICE 'Found % users in auth.users table.', user_count;
END $$;

-- Insert sample profiles using the user IDs from the temp table
-- Only insert profiles for actual users (those from auth.users)
DO $$
DECLARE
  user_record RECORD;
  profile_names TEXT[] := ARRAY['Ahmed Al-Sabah', 'Fatima Al-Qadiri', 'Mohammed Al-Mutairi', 'Noura Al-Fahad'];
  profile_emails TEXT[] := ARRAY['ahmed@example.com', 'fatima@example.com', 'mohammed@example.com', 'noura@example.com'];
  profile_types TEXT[] := ARRAY['buyer', 'renter', 'investor', 'student'];
BEGIN
  -- Insert profiles one by one to avoid conflicts
  FOR user_record IN SELECT * FROM temp_user_ids t 
                     WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = t.user_id)
                     ORDER BY t.index
  LOOP
    INSERT INTO profiles (id, full_name, avatar_url, email, user_type)
    VALUES (
      user_record.user_id,
      profile_names[user_record.index],
      storage_url('avatars', user_record.user_id || '/profile.jpg'),
      profile_emails[user_record.index],
      profile_types[user_record.index]
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url,
      email = EXCLUDED.email,
      user_type = EXCLUDED.user_type;
  END LOOP;
END $$;

-- Insert sample properties
INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, amenities, images, owner_id)
SELECT
  'Modern Apartment in Salmiya',
  'A beautiful modern apartment in the heart of Salmiya with sea view.',
  450,
  'Salem Al Mubarak Street, Salmiya, Kuwait',
  'apartment',
  2,
  2,
  120,
  ARRAY['pool', 'gym', 'parking', 'elevator', 'security'],
  ARRAY[
    storage_url('property_images', user_id || '/apartment1.jpg'),
    storage_url('property_images', user_id || '/apartment2.jpg')
  ],
  user_id
FROM temp_user_ids WHERE index = 1 
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, amenities, images, owner_id)
SELECT
  'Spacious Villa in Bayan',
  'Perfect for families, this villa offers plenty of space and a large garden in Bayan area.',
  1200,
  'Block 8, Bayan, Kuwait',
  'house',
  5,
  4,
  450,
  ARRAY['garden', 'garage', 'maid_room', 'basement', 'patio'],
  ARRAY[
    storage_url('property_images', user_id || '/house1.jpg'),
    storage_url('property_images', user_id || '/house2.jpg')
  ],
  user_id
FROM temp_user_ids WHERE index = 1
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, amenities, images, owner_id)
SELECT
  'Luxury Apartment in Kuwait City',
  'Stunning views from this luxury apartment in Kuwait City with modern amenities.',
  850,
  'Al Hamra Tower, Sharq, Kuwait City',
  'condo',
  3,
  3,
  200,
  ARRAY['balcony', 'concierge', 'gym', 'pool', 'smart_home'],
  ARRAY[
    storage_url('property_images', user_id || '/condo1.jpg'),
    storage_url('property_images', user_id || '/condo2.jpg')
  ],
  user_id
FROM temp_user_ids WHERE index = 2
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, amenities, images, owner_id)
SELECT
  'Cozy Apartment in Jabriya',
  'A cozy apartment in a quiet neighborhood in Jabriya with great amenities.',
  550,
  'Block 12, Jabriya, Kuwait',
  'apartment',
  3,
  2,
  160,
  ARRAY['community pool', 'playground', 'parking', 'storage', 'pet friendly'],
  ARRAY[
    storage_url('property_images', user_id || '/townhouse1.jpg'),
    storage_url('property_images', user_id || '/townhouse2.jpg')
  ],
  user_id
FROM temp_user_ids WHERE index = 2
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, amenities, images, owner_id)
SELECT
  'Investment Land in Sabah Al-Ahmad',
  'Prime land for development in the growing area of Sabah Al-Ahmad City.',
  300000,
  'Sabah Al-Ahmad City, Kuwait',
  'land',
  0,
  0,
  1000,
  ARRAY['utilities ready', 'road access', 'zoned residential'],
  ARRAY[
    storage_url('property_images', user_id || '/land1.jpg'),
    storage_url('property_images', user_id || '/land2.jpg')
  ],
  user_id
FROM temp_user_ids WHERE index = 3
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

-- Insert sample transportation services
INSERT INTO transportation_services (name, description, service_type, price_range, location, contact_info, website, images)
VALUES
  ('Kuwait Movers', 'Professional moving service for all your needs within Kuwait and GCC countries.', 'moving', 'medium', 'Kuwait City, Kuwait', 'contact@kuwaitmovers.com | +965 2222-3333', 'https://kuwaitmovers.example.com', 
   ARRAY[
     storage_url('transportation_images', 'services/quickmove1.jpg'),
     storage_url('transportation_images', 'services/quickmove2.jpg')
   ]),
   
  ('Careem Kuwait', 'Affordable ride sharing service available 24/7 throughout Kuwait.', 'ride_sharing', 'low', 'All Kuwait Areas', 'support@careem.com | +965 9999-8888', 'https://careem.com', 
   ARRAY[
     storage_url('transportation_images', 'services/rideshare1.jpg'),
     storage_url('transportation_images', 'services/rideshare2.jpg')
   ]),
   
  ('Kuwait Public Transport Company', 'Public transportation network covering the entire Kuwait with bus services.', 'public_transport', 'low', 'Kuwait City, Kuwait', 'info@kptc.com.kw | +965 1830-830', 'https://kptc.com.kw', 
   ARRAY[
     storage_url('transportation_images', 'services/metro1.jpg'),
     storage_url('transportation_images', 'services/metro2.jpg')
   ]),
   
  ('Q8 Car Rental', 'Premium car rental service with a wide selection of vehicles for all your needs in Kuwait.', 'car_rental', 'high', 'Kuwait International Airport & Salmiya', 'reservations@q8carrental.com | +965 5555-4444', 'https://q8carrental.example.com', 
   ARRAY[
     storage_url('transportation_images', 'services/luxcar1.jpg'),
     storage_url('transportation_images', 'services/luxcar2.jpg')
   ]);

-- Insert sample user preferences
INSERT INTO user_preferences (user_id, property_type, price_min, price_max, bedrooms_min, bathrooms_min, size_min, preferred_locations, preferred_amenities, transportation_preferences)
SELECT
  user_id,
  ARRAY['house', 'townhouse'],
  800,
  1500,
  4,
  3,
  300,
  ARRAY['Bayan', 'Mishref', 'Surra'],
  ARRAY['garage', 'garden', 'maid_room'],
  ARRAY['car_rental']
FROM temp_user_ids WHERE index = 1
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO user_preferences (user_id, property_type, price_min, price_max, bedrooms_min, bathrooms_min, size_min, preferred_locations, preferred_amenities, transportation_preferences)
SELECT
  user_id,
  ARRAY['apartment', 'condo'],
  400,
  700,
  2,
  2,
  100,
  ARRAY['Salmiya', 'Jabriya', 'Shaab'],
  ARRAY['gym', 'pool', 'security'],
  ARRAY['public_transport', 'ride_sharing']
FROM temp_user_ids WHERE index = 2
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO user_preferences (user_id, property_type, price_min, price_max, bedrooms_min, bathrooms_min, size_min, preferred_locations, preferred_amenities, transportation_preferences)
SELECT
  user_id,
  ARRAY['land', 'house'],
  200000,
  500000,
  0,
  0,
  500,
  ARRAY['Sabah Al-Ahmad', 'Wafra', 'Khairan'],
  ARRAY['utilities ready', 'road access'],
  ARRAY['moving']
FROM temp_user_ids WHERE index = 3
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO user_preferences (user_id, property_type, price_min, price_max, bedrooms_min, bathrooms_min, size_min, preferred_locations, preferred_amenities, transportation_preferences)
SELECT
  user_id,
  ARRAY['apartment', 'townhouse'],
  300,
  600,
  1,
  1,
  80,
  ARRAY['Hawally', 'Salmiya', 'Kuwait City'],
  ARRAY['pet friendly', 'parking', 'security'],
  ARRAY['public_transport']
FROM temp_user_ids WHERE index = 4
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

-- Insert sample conversations
INSERT INTO conversations (user_id, messages, is_active)
SELECT
  user_id,
  '[
    {"role": "user", "content": "I am looking for a villa in Bayan with at least 4 bedrooms.", "timestamp": "2023-05-01T10:00:00Z"},
    {"role": "assistant", "content": "I can help you with that! There are several options in Bayan. Would you prefer a newer construction or something with more character?", "timestamp": "2023-05-01T10:01:00Z"},
    {"role": "user", "content": "I prefer newer construction with modern amenities.", "timestamp": "2023-05-01T10:02:00Z"},
    {"role": "assistant", "content": "Great! I have found a spacious villa in Block 8, Bayan with 5 bedrooms and 4 bathrooms. Would you like to see more details?", "timestamp": "2023-05-01T10:03:00Z"}
  ]'::jsonb,
  true
FROM temp_user_ids WHERE index = 1
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO conversations (user_id, messages, is_active)
SELECT
  user_id,
  '[
    {"role": "user", "content": "I need an apartment in Salmiya with a gym and pool.", "timestamp": "2023-05-02T14:00:00Z"},
    {"role": "assistant", "content": "I have several options that match your criteria. What is your budget range?", "timestamp": "2023-05-02T14:01:00Z"},
    {"role": "user", "content": "Around 400 to 500 KWD per month.", "timestamp": "2023-05-02T14:02:00Z"},
    {"role": "assistant", "content": "I found a modern apartment on Salem Al Mubarak Street in Salmiya with 2 bedrooms, 2 bathrooms, and both a gym and pool. The price is 450 KWD per month. Would you like more information?", "timestamp": "2023-05-02T14:03:00Z"}
  ]'::jsonb,
  true
FROM temp_user_ids WHERE index = 2
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO conversations (user_id, messages, is_active)
SELECT
  user_id,
  '[
    {"role": "user", "content": "I am looking for investment land opportunities in Kuwait.", "timestamp": "2023-05-03T09:00:00Z"},
    {"role": "assistant", "content": "There are several investment opportunities available. What size of land are you interested in?", "timestamp": "2023-05-03T09:01:00Z"},
    {"role": "user", "content": "At least 500 square meters, preferably with utilities already set up.", "timestamp": "2023-05-03T09:02:00Z"},
    {"role": "assistant", "content": "I found a prime land opportunity in Sabah Al-Ahmad City. It is 1000 square meters with utilities ready and road access, priced at 300,000 KWD. Would you like more details?", "timestamp": "2023-05-03T09:03:00Z"}
  ]'::jsonb,
  true
FROM temp_user_ids WHERE index = 3
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

INSERT INTO conversations (user_id, messages, is_active)
SELECT
  user_id,
  '[
    {"role": "user", "content": "I need affordable transportation options near Hawally.", "timestamp": "2023-05-04T16:00:00Z"},
    {"role": "assistant", "content": "There are several transportation options in Hawally. Are you looking for public transport or ride sharing?", "timestamp": "2023-05-04T16:01:00Z"},
    {"role": "user", "content": "Public transport would be ideal.", "timestamp": "2023-05-04T16:02:00Z"},
    {"role": "assistant", "content": "Kuwait Public Transport Company offers comprehensive coverage in Hawally with affordable rates. They have bus routes connecting to Kuwait City and other areas. Would you like their contact information?", "timestamp": "2023-05-04T16:03:00Z"}
  ]'::jsonb,
  true
FROM temp_user_ids WHERE index = 4
AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id);

-- Drop the temporary table
DROP TABLE temp_user_ids;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Confirmation message
DO $$
BEGIN
    RAISE NOTICE 'Database has been seeded with sample data for testing.';
END $$;
