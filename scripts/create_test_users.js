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
    
    // Try the alternative method first (using Supabase's auth API)
    const altSqlFilePath = path.join(__dirname, '../db/migrations/create_test_users_alt.sql');
    const altSqlContent = fs.readFileSync(altSqlFilePath, 'utf8');
    
    console.log('Attempting to create users using Supabase auth API...');
    const { error: altError } = await supabase.rpc('exec_sql', { sql: altSqlContent });
    
    if (!altError) {
      console.log('✅ Test users created successfully using Supabase auth API!');
    } else {
      console.log('⚠️ Could not create users with Supabase auth API method:', altError.message);
      console.log('Trying direct table access method...');
      
      // If the alternative method fails, try the direct table access method
      const sqlFilePath = path.join(__dirname, '../db/migrations/create_test_users.sql');
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      
      const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
      
      if (error) {
        throw error;
      } else {
        console.log('✅ Test users created successfully using direct table access!');
      }
    }
    
    console.log('\nTest User Credentials:');
    console.log('------------------------');
    console.log('Renter: test.renter@example.com / password123');
    console.log('Buyer: test.buyer@example.com / password123');
    console.log('Owner: test.owner@example.com / password123');
    console.log('Admin: test.admin@example.com / password123');
    console.log('\nYou can now log in with these credentials in the application.');
    
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
      console.error(`- ${path.join(__dirname, '../db/migrations/create_test_users_alt.sql')}`);
      console.error(`- ${path.join(__dirname, '../db/migrations/create_test_users.sql')}`);
    } else if (error.message.includes('permission denied')) {
      console.error('\nPermission denied. Your service role key might not have sufficient privileges.');
      console.error('Try running the SQL directly in the Supabase SQL editor or use the manual method described in docs/TEST_USERS.md');
    }
  }
}

createTestUsers(); 