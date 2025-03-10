// Script to create test users for each role in Supabase
// Run with: node scripts/create_test_users.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing required environment variables.');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
  process.exit(1);
}

// Initialize Supabase client with service role key (required for auth operations)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUsers() {
  try {
    console.log('Creating test users for each role...');
    
    // Try the admin method first (most reliable)
    const adminSqlFilePath = path.join(__dirname, '../db/migrations/create_test_users_admin.sql');
    const adminSqlContent = fs.readFileSync(adminSqlFilePath, 'utf8');
    
    console.log('Attempting to create users using direct auth table insertion (admin method)...');
    const { error: adminError } = await supabase.rpc('exec_sql', { sql: adminSqlContent });
    
    if (!adminError) {
      console.log('✅ Test users created successfully using admin method!');
      outputCredentials();
      return;
    }
    
    console.log('⚠️ Could not create users with admin method:', adminError.message);
    console.log('Trying direct table access method...');
    
    // If the admin method fails, try the direct table access method
    const sqlFilePath = path.join(__dirname, '../db/migrations/create_test_users.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (!error) {
      console.log('✅ Test users created successfully using direct table access!');
      outputCredentials();
      return;
    }
    
    console.log('⚠️ Could not create users with direct table access method:', error.message);
    console.log('Trying Supabase auth API method...');
    
    // If both previous methods fail, try the auth API method
    const altSqlFilePath = path.join(__dirname, '../db/migrations/create_test_users_alt.sql');
    const altSqlContent = fs.readFileSync(altSqlFilePath, 'utf8');
    
    const { error: altError } = await supabase.rpc('exec_sql', { sql: altSqlContent });
    
    if (!altError) {
      console.log('✅ Test users created successfully using Supabase auth API!');
      outputCredentials();
      return;
    }
    
    throw new Error('All methods failed. See error messages above for details.');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
    
    if (error.message.includes('function exec_sql() does not exist')) {
      console.error('\nThe exec_sql function is not available in your Supabase project.');
      console.error('You need to create this function or run the SQL directly in the Supabase SQL editor.');
      console.error('\nTo create the exec_sql function, run this SQL in the Supabase SQL editor:');
      console.error(`
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
      `);
      console.error('\nAlternatively, you can run the SQL files directly in the Supabase SQL editor:');
      console.error(`1. ${path.join(__dirname, '../db/migrations/create_test_users_admin.sql')} (most reliable)`);
      console.error(`2. ${path.join(__dirname, '../db/migrations/create_test_users.sql')}`);
      console.error(`3. ${path.join(__dirname, '../db/migrations/create_test_users_alt.sql')}`);
    } else if (error.message.includes('permission denied')) {
      console.error('\nPermission denied. Your service role key might not have sufficient privileges.');
      console.error('Try running the SQL directly in the Supabase SQL editor or use the manual method described in docs/TEST_USERS.md');
    }
  }
}

function outputCredentials() {
  console.log('\nTest User Credentials:');
  console.log('------------------------');
  console.log('Renter: test.renter@example.com / password123');
  console.log('Buyer: test.buyer@example.com / password123');
  console.log('Owner: test.owner@example.com / password123');
  console.log('Admin: test.admin@example.com / password123');
  console.log('\nYou can now log in with these credentials in the application.');
}

createTestUsers(); 