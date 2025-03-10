# Admin Dashboard Access

The admin dashboard provides a way to manage properties, users, and transportation services in the application. To access the admin dashboard, you need to have admin privileges.

## How to Access the Admin Dashboard

1. Register for an account or log in to your existing account
2. Make your user an admin (see below)
3. Navigate to `/routes/admin` in your browser

## Making a User an Admin

There are four ways to make a user an admin:

### Option 1: Using the Admin Check Page (Recommended)

1. Navigate to `/routes/admin-check` in your browser
2. The page will show your current admin status
3. If you're not an admin, click the "Make Me Admin" button
4. Once your status changes to admin, you can access the admin dashboard

### Option 2: Using the Direct Admin Script

This is the most reliable method if you're having issues with the admin check page:

1. Make sure you have Node.js installed
2. Run the following command from the project root:

```bash
node scripts/direct_admin.js
```

3. Enter your email address when prompted
4. The script will update your user to have admin privileges directly in the database
5. Log out and log back in to refresh your session

### Option 3: Using the Make Admin Script

1. Make sure you have Node.js installed
2. Run the following command from the project root:

```bash
node scripts/make_admin.js
```

3. Enter your email address when prompted
4. The script will update your user to have admin privileges

### Option 4: Using Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL, replacing `YOUR_EMAIL_HERE` with your email:

```sql
-- Temporarily disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Update the user's profile to set is_admin to true
UPDATE profiles
SET is_admin = true
WHERE email = 'YOUR_EMAIL_HERE';

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Output the result
SELECT id, email, full_name, is_admin 
FROM profiles 
WHERE email = 'YOUR_EMAIL_HERE';
```

## Admin Dashboard Features

The admin dashboard provides the following features:

1. **Properties Management**
   - View all properties
   - Edit property details
   - Delete properties
   - Add new properties

2. **Users Management**
   - View all users
   - Edit user details
   - Delete users
   - Change user roles

3. **Transportation Management**
   - View all transportation services
   - Edit service details
   - Delete services
   - Add new services

## Troubleshooting

If you're having trouble accessing the admin dashboard:

1. Visit the admin check page at `/routes/admin-check` to verify your admin status
2. Make sure you're logged in with the correct account
3. Try using the "Make Me Admin" button on the admin check page
4. If the admin check page shows "No active session found" even though you're logged in:
   - Try logging out and logging back in
   - Use the direct admin script (`node scripts/direct_admin.js`) to set your admin status directly
   - Clear your browser cache and cookies
5. If you're redirected to the login page when trying to access the admin dashboard:
   - Make sure you're logged in
   - Check that your user has admin privileges on the admin check page
   - Try accessing the admin dashboard directly after using the admin check page
   - Clear your browser cache and cookies
   - Try using a different browser
6. Check the browser console for any error messages
7. If all else fails, use the Supabase SQL Editor method to directly update your user in the database 