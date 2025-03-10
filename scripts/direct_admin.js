#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to the SQL file
const sqlFilePath = path.join(__dirname, 'direct_admin.sql');

console.log('=== Direct Admin Script ===');
console.log('This script will directly make a user an admin in your Supabase database.');
console.log('');

rl.question('Enter the email of the user you want to make an admin: ', async (email) => {
  if (!email || !email.includes('@')) {
    console.error('Error: Please provide a valid email address.');
    rl.close();
    return;
  }

  try {
    // Read the SQL file
    let sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Replace the placeholder with the actual email
    sqlContent = sqlContent.replace(/YOUR_EMAIL_HERE/g, email);
    
    // Create a temporary SQL file with the updated content
    const tempSqlFilePath = path.join(__dirname, 'temp_direct_admin.sql');
    fs.writeFileSync(tempSqlFilePath, sqlContent);
    
    console.log(`\nUpdating user ${email} to have admin privileges...`);
    
    // Try to use Supabase directly if environment variables are available
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        
        // Execute each SQL statement separately
        const sqlStatements = sqlContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);
        
        for (const stmt of sqlStatements) {
          const { data, error } = await supabase.rpc('exec_sql', { sql: stmt });
          if (error) throw new Error(`SQL execution error: ${error.message}`);
        }
        
        console.log('\nSuccess! The user has been updated to have admin privileges.');
        console.log('You can now access the admin dashboard at /routes/admin');
      } catch (supabaseError) {
        console.error('\nError executing SQL via Supabase client:');
        console.error(supabaseError.message);
        console.error('\nTrying alternative method...');
        
        // Fall back to Supabase CLI
        try {
          const output = execSync(`supabase db execute --file ${tempSqlFilePath}`, { 
            encoding: 'utf8',
            stdio: 'pipe'
          });
          
          console.log('\nSuccess! The user has been updated to have admin privileges.');
          console.log('You can now access the admin dashboard at /routes/admin');
        } catch (execError) {
          console.error('\nError executing SQL via Supabase CLI:');
          console.error(execError.message);
          console.error('\nManual instructions:');
          console.error('1. Go to your Supabase project dashboard');
          console.error('2. Navigate to the SQL Editor');
          console.error('3. Copy and paste the following SQL, replacing YOUR_EMAIL_HERE with your email:');
          console.error('\n-------------------------------------------');
          console.log(sqlContent);
          console.error('-------------------------------------------');
        }
      }
    } else {
      // Fall back to Supabase CLI if environment variables are not available
      try {
        const output = execSync(`supabase db execute --file ${tempSqlFilePath}`, { 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        console.log('\nSuccess! The user has been updated to have admin privileges.');
        console.log('You can now access the admin dashboard at /routes/admin');
      } catch (execError) {
        console.error('\nError executing SQL:');
        console.error(execError.message);
        console.error('\nManual instructions:');
        console.error('1. Go to your Supabase project dashboard');
        console.error('2. Navigate to the SQL Editor');
        console.error('3. Copy and paste the following SQL, replacing YOUR_EMAIL_HERE with your email:');
        console.error('\n-------------------------------------------');
        console.log(sqlContent);
        console.error('-------------------------------------------');
      }
    }
    
    // Clean up the temporary file
    if (fs.existsSync(tempSqlFilePath)) {
      fs.unlinkSync(tempSqlFilePath);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  rl.close();
}); 