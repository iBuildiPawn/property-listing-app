#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to the SQL file
const sqlFilePath = path.join(__dirname, '../db/migrations/make_admin.sql');

console.log('=== Make User Admin ===');
console.log('This script will update a user to have admin privileges in your Supabase database.');
console.log('Make sure you have the Supabase CLI installed and are logged in.');
console.log('');

rl.question('Enter the email of the user you want to make an admin: ', (email) => {
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
    const tempSqlFilePath = path.join(__dirname, '../db/migrations/temp_make_admin.sql');
    fs.writeFileSync(tempSqlFilePath, sqlContent);
    
    console.log(`\nUpdating user ${email} to have admin privileges...`);
    
    try {
      // Run the SQL file using Supabase CLI
      const output = execSync(`supabase db execute --file ${tempSqlFilePath}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log('\nSuccess! The user has been updated to have admin privileges.');
      console.log('You can now access the admin dashboard at /routes/admin');
      
      // Clean up the temporary file
      fs.unlinkSync(tempSqlFilePath);
    } catch (execError) {
      console.error('\nError executing SQL:');
      console.error(execError.message);
      console.error('\nIf you don\'t have the Supabase CLI installed or configured, you can:');
      console.error('1. Go to your Supabase project dashboard');
      console.error('2. Navigate to the SQL Editor');
      console.error('3. Copy and paste the following SQL, replacing YOUR_EMAIL_HERE with your email:');
      console.error('\n-------------------------------------------');
      console.log(sqlContent);
      console.error('-------------------------------------------');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  rl.close();
}); 