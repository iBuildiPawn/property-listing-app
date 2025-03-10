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

There are several ways to create these test users:

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
3. Choose one of the following SQL scripts:
   - `db/migrations/create_test_users_admin.sql` - Direct insertion into auth tables (most reliable)
   - `db/migrations/create_test_users.sql` - Uses direct table access with UUID generation
   - `db/migrations/create_test_users_alt.sql` - Uses Supabase's auth API (may not work in all environments)
4. Paste the SQL into the editor and run it.
5. Check the logs to confirm the users were created successfully.

### Method 3: Using the Supabase Dashboard

If you encounter issues with the automated methods, you can manually create users:

1. Log in to your Supabase dashboard.
2. Navigate to Authentication > Users.
3. Click "Add User" and fill in the details for each test user.
4. After creating the users, navigate to the SQL Editor.
5. Run the following SQL to set up the profiles and roles:

```sql
-- For each user you created, run this SQL with the appropriate values
INSERT INTO profiles (id, full_name, email, user_type, is_admin)
VALUES 
  ('user-id-from-auth-users', 'Test Renter', 'test.renter@example.com', 'renter', false),
  ('user-id-from-auth-users', 'Test Buyer', 'test.buyer@example.com', 'buyer', false),
  ('user-id-from-auth-users', 'Test Owner', 'test.owner@example.com', 'owner', false),
  ('user-id-from-auth-users', 'Test Admin', 'test.admin@example.com', 'owner', true);
```

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

1. **Permission Issues**: 
   - Try using the `create_test_users_admin.sql` script first, which directly inserts into auth tables.
   - If that fails, the `create_test_users.sql` script requires direct access to the `auth.users` table.
   - The `create_test_users_alt.sql` script uses Supabase's auth API but may not work in all environments.
   - If all scripts fail, use Method 3 (manual creation).

2. **Database Constraints**: 
   - Make sure the user_type values match the allowed values in the database ('renter', 'buyer', 'owner').
   - Check that the profiles table has the correct constraints.

3. **Authentication Issues**: 
   - Verify that users exist in both auth.users and profiles tables.
   - Check that the IDs match between the tables.

4. **RLS Policies**: 
   - Ensure Row Level Security policies are correctly set up for each role.

5. **Common Errors**:
   - "function auth.create_user() does not exist" - Use the `create_test_users_admin.sql` script instead.
   - "column reference is ambiguous" - This has been fixed in the latest scripts.
   - "null value in column violates not-null constraint" - Use the `create_test_users_admin.sql` script.

## Cleaning Up Test Users

To remove test users:

```sql
-- Run this in the Supabase SQL Editor
DELETE FROM auth.users WHERE email LIKE 'test.%@example.com';
-- Profiles will be automatically deleted due to CASCADE constraint
``` 