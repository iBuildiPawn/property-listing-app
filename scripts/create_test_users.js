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
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../db/migrations/create_test_users.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Test users created successfully!');
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
      console.error('You may need to run this SQL directly in the Supabase SQL editor.');
      console.error(`SQL file path: ${path.join(__dirname, '../db/migrations/create_test_users.sql')}`);
    }
  }
}

createTestUsers(); 