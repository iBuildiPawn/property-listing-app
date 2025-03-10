# Test Users Guide

This document provides instructions for creating and using test users in the Property Listing application.

## Available Test Users

The application includes test users for each role:

1. **Renter**
   - Email: test.renter@example.com
   - Password: password123
   - Role: Renter (can browse properties)

2. **Buyer**
   - Email: test.buyer@example.com
   - Password: password123
   - Role: Buyer (can browse properties)

3. **Owner**
   - Email: test.owner@example.com
   - Password: password123
   - Role: Owner (can list properties)
   - Has a sample property already created

4. **Admin**
   - Email: test.admin@example.com
   - Password: password123
   - Role: Owner with admin privileges
   - Has access to the admin dashboard

## Creating Test Users

There are two ways to create these test users:

### Method 1: Using the JavaScript Script (Recommended)

1. Make sure your environment variables are set up correctly in your `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Run the script:
   ```bash
   node scripts/create_test_users.js
   ```

3. The script will create all test users and output their credentials.

### Method 2: Using the Supabase SQL Editor

1. Log in to your Supabase dashboard.
2. Navigate to the SQL Editor.
3. Copy the contents of `db/migrations/create_test_users.sql`.
4. Paste the SQL into the editor and run it.
5. Check the logs to confirm the users were created successfully.

## Using Test Users

1. Launch the application.
2. Navigate to the login page.
3. Enter the credentials for the desired test user.
4. Explore the application with the specific role's permissions.

### Role-Specific Features

- **Renter**: Can browse properties, view details, and save favorites.
- **Buyer**: Can browse properties, view details, and save favorites.
- **Owner**: Can do everything Renters and Buyers can do, plus create, edit, and delete their own property listings.
- **Admin**: Has all permissions and can access the admin dashboard at `/routes/admin/dashboard`.

## Troubleshooting

If you encounter issues creating or using test users:

1. **Database Constraints**: Make sure the user_type values match the allowed values in the database ('renter', 'buyer', 'owner').
2. **Authentication Issues**: Check that the auth.users table entries match the profiles table entries.
3. **Permission Issues**: Verify that the Row Level Security (RLS) policies are correctly set up.

## Cleaning Up Test Users

To remove test users:

```sql
-- Run this in the Supabase SQL Editor
DELETE FROM auth.users WHERE email LIKE 'test.%@example.com';
-- Profiles will be automatically deleted due to CASCADE constraint
``` 