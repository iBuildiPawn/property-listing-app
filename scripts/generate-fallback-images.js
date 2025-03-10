/**
 * Script to generate fallback images for common property and transportation types
 * This creates images that can be used as local fallbacks when Supabase storage fails
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configuration
const outputDir = path.join(__dirname, '../public/images');
const width = 800;
const height = 600;

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Property types to generate images for
const propertyTypes = [
  'house', 'apartment', 'villa', 'condo', 'townhouse', 'land'
];

// Transportation types to generate images for
const transportationTypes = [
  'car', 'bus', 'truck', 'moving', 'taxi', 'rental'
];

// Colors for different types
const colors = {
  property: '#3b82f6', // blue
  transportation: '#10b981', // green
};

/**
 * Generate a placeholder image with text
 * @param {string} text Text to display on the image
 * @param {string} color Background color
 * @param {string} filename Output filename
 */
function generateImage(text, color, filename) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Add some visual interest with a pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 50 + Math.random() * 100;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Add "Fallback Image" text
  ctx.font = '24px Arial';
  ctx.fillText('Fallback Image', width / 2, height / 2 + 50);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(outputDir, filename), buffer);
  console.log(`Generated ${filename}`);
}

// Generate property images
propertyTypes.forEach((type, index) => {
  // Generate multiple variations for each type
  for (let i = 1; i <= 3; i++) {
    generateImage(
      `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      colors.property,
      `${type}${i}.jpg`
    );
  }
});

// Generate transportation images
transportationTypes.forEach((type, index) => {
  // Generate multiple variations for each type
  for (let i = 1; i <= 3; i++) {
    generateImage(
      `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      colors.transportation,
      `${type}${i}.jpg`
    );
  }
});

console.log('All fallback images generated successfully!'); 