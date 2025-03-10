/**
 * This script analyzes the application's bundle size
 * Run with: node scripts/analyze-bundle.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a temporary .env.analyze file
const envPath = path.join(__dirname, '..', '.env.analyze');
fs.writeFileSync(envPath, 'ANALYZE=true\n');

console.log('Starting bundle analysis...');
console.log('This will build the application and generate bundle analysis reports.');

try {
  // Run the Next.js build with bundle analyzer enabled
  execSync('next build', {
    env: { ...process.env, ANALYZE: 'true' },
    stdio: 'inherit',
  });

  console.log('\nBundle analysis complete!');
  console.log('\nRecommendations for optimizing bundle size:');
  console.log('1. Use dynamic imports for large components that are not needed on initial load');
  console.log('2. Split vendor chunks to optimize caching');
  console.log('3. Optimize image assets using next/image');
  console.log('4. Use tree-shaking friendly imports (e.g., import { Button } from \'@/components/ui/button\')');
  console.log('5. Consider using smaller alternatives for large dependencies');
} catch (error) {
  console.error('Error analyzing bundle:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary .env.analyze file
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
  }
} 