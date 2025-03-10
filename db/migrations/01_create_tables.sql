-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT NOT NULL,
  user_type TEXT CHECK (user_type IN ('renter', 'buyer', 'investor', 'student')),
  
  CONSTRAINT profiles_email_key UNIQUE (email)
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'condo', 'townhouse', 'land')),
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  size NUMERIC NOT NULL,
  amenities TEXT[] NOT NULL,
  images TEXT[] NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Create transportation_services table
CREATE TABLE IF NOT EXISTS transportation_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('moving', 'ride_sharing', 'public_transport', 'car_rental')),
  price_range TEXT NOT NULL CHECK (price_range IN ('low', 'medium', 'high')),
  location TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  website TEXT,
  images TEXT[] NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_type TEXT[] DEFAULT '{}',
  price_min NUMERIC,
  price_max NUMERIC,
  bedrooms_min INTEGER,
  bathrooms_min INTEGER,
  size_min NUMERIC,
  preferred_locations TEXT[] DEFAULT '{}',
  preferred_amenities TEXT[] DEFAULT '{}',
  transportation_preferences TEXT[] DEFAULT '{}'
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone" 
ON properties FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert properties" 
ON properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own properties" 
ON properties FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own properties" 
ON properties FOR DELETE USING (auth.uid() = owner_id);

-- Transportation services policies
CREATE POLICY "Transportation services are viewable by everyone" 
ON transportation_services FOR SELECT USING (true);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" 
ON user_preferences FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" 
ON user_preferences FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations" 
ON conversations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" 
ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
ON conversations FOR UPDATE USING (auth.uid() = user_id);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transportation_services_updated_at
BEFORE UPDATE ON transportation_services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 