# Database Migrations

This directory contains SQL migration scripts for setting up and seeding the Supabase database for the Property Listing & Transportation App.

## Migration Files

- `01_create_tables.sql`: Creates all necessary tables, triggers, and RLS policies
- `02_seed_data.sql`: Seeds the database with sample properties and transportation services

## How to Apply Migrations

These migrations should be applied in the Supabase SQL Editor in the following order:

1. First, run `01_create_tables.sql` to create the database schema
2. Then, run `02_seed_data.sql` to populate the database with sample data

## Database Schema

The database consists of the following tables:

### profiles
- Stores user profile information
- Linked to Supabase Auth users
- Contains user preferences and type (renter, buyer, investor, student)

### properties
- Stores property listings
- Includes details like price, location, type, amenities, etc.
- Linked to owner profiles

### transportation_services
- Stores transportation service listings
- Includes details like service type, price range, location, etc.

### user_preferences
- Stores user preferences for properties and transportation
- Used for personalized recommendations

### conversations
- Stores chat conversations between users and the chatbot
- Contains message history and metadata

## Row Level Security (RLS)

The database uses Supabase RLS policies to secure data:

- Public data (properties, transportation services) is viewable by everyone
- User-specific data (profiles, preferences, conversations) is only accessible by the owner
- Only authenticated users can create new records
- Users can only update or delete their own records

## Triggers

Automatic triggers are set up to:

- Update the `updated_at` timestamp whenever a record is modified 