/**
 * This script generates placeholder images for the application
 * Run with: node scripts/generate-placeholders.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configuration
const placeholders = [
  { name: 'property', width: 800, height: 600, color: '#e2e8f0', text: 'Property Image' },
  { name: 'transportation', width: 800, height: 600, color: '#e2e8f0', text: 'Transportation Image' },
  { name: 'user', width: 400, height: 400, color: '#e2e8f0', text: 'User Image' },
  { name: 'image', width: 800, height: 600, color: '#e2e8f0', text: 'Image' },
];

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate placeholder images
placeholders.forEach(({ name, width, height, color, text }) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = '#94a3b8';
  ctx.font = `bold ${Math.floor(width / 20)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Save image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(publicDir, `placeholder-${name}.jpg`), buffer);
  console.log(`Generated placeholder-${name}.jpg`);
});

console.log('All placeholder images generated successfully!'); 