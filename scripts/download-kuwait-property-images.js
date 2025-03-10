/**
 * Script to download property images from Unsplash and generate Kuwait-specific mock data
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createCanvas } = require('canvas');

// Configuration
const outputDir = path.join(__dirname, '../public/property_images');
const mockDataFile = path.join(__dirname, '../public/kuwait_properties_mock_data.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Kuwait-specific locations
const kuwaitLocations = [
  'Salmiya, Kuwait',
  'Hawally, Kuwait',
  'Kuwait City, Kuwait',
  'Mangaf, Kuwait',
  'Fahaheel, Kuwait',
  'Jahra, Kuwait',
  'Sabah Al-Salem, Kuwait',
  'Fintas, Kuwait',
  'Mahboula, Kuwait',
  'Farwaniya, Kuwait',
  'Ahmadi, Kuwait',
  'Salwa, Kuwait',
  'Rumaithiya, Kuwait',
  'Bayan, Kuwait',
  'Mishref, Kuwait'
];

// Kuwait-specific property features
const kuwaitAmenities = [
  'Central Air Conditioning',
  'Balcony',
  'Swimming Pool',
  'Gym',
  'Covered Parking',
  'Security System',
  'Maid\'s Room',
  'Built-in Wardrobes',
  'Marble Flooring',
  'Sea View',
  'Garden',
  'Elevator',
  'Satellite/Cable TV',
  'Concierge Service',
  'Children\'s Play Area',
  'Mosque Nearby',
  'Co-op Nearby',
  'Avenues Mall Access',
  'Equipped Kitchen',
  'Furnished'
];

// Property types
const propertyTypes = [
  'apartment',
  'villa',
  'penthouse',
  'townhouse',
  'duplex',
  'chalet'
];

// Unsplash collections for different property types
const unsplashUrls = {
  apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858'
  ],
  villa: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    'https://images.unsplash.com/photo-1600607687644-aac13ae8f61c',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791'
  ],
  penthouse: [
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea'
  ],
  townhouse: [
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
    'https://images.unsplash.com/photo-1625602812206-5ec545ca1231',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
    'https://images.unsplash.com/photo-1576941089067-2de3c901e126'
  ],
  duplex: [
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
    'https://images.unsplash.com/photo-1600585154526-990dced4db3d',
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154',
    'https://images.unsplash.com/photo-1600566753051-f8e0f2f1f3fb',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
  ],
  chalet: [
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    'https://images.unsplash.com/photo-1585543805890-6051f7829f98',
    'https://images.unsplash.com/photo-1551524559-8af4e6624178'
  ]
};

// Function to download an image from a URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    // Add Unsplash parameters for proper attribution and sizing
    const fullUrl = `${url}?q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1200&fit=max&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4NjY2Njg4Mg`;
    
    https.get(fullUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(filename);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve(filename);
      });
      
      file.on('error', (err) => {
        fs.unlink(filename, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get random items from an array
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to generate a random price based on property type and size
function generatePrice(type, size, bedrooms) {
  // Kuwait-specific pricing (in KWD)
  const basePrice = {
    apartment: 300,
    villa: 1200,
    penthouse: 1500,
    townhouse: 900,
    duplex: 800,
    chalet: 1000
  };
  
  // For sale properties (not apartments or penthouses)
  if (type !== 'apartment' && type !== 'penthouse') {
    // Sale prices in KWD (much higher)
    const baseSalePrice = {
      villa: 300000,
      townhouse: 200000,
      duplex: 180000,
      chalet: 250000
    };
    
    // Calculate price based on size and bedrooms with some randomness
    const price = baseSalePrice[type] + (size * 500) + (bedrooms * 20000);
    // Add some randomness (±10%)
    return Math.round(price * (0.9 + Math.random() * 0.2));
  }
  
  // For rental properties (apartments and penthouses)
  // Calculate price based on size and bedrooms with some randomness
  const price = basePrice[type] + (size * 0.5) + (bedrooms * 50);
  // Add some randomness (±15%)
  return Math.round(price * (0.85 + Math.random() * 0.3));
}

// Generate 10 Kuwait-specific property listings
async function generateProperties() {
  const properties = [];
  
  for (let i = 1; i <= 10; i++) {
    // Select a random property type
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    
    // Generate random property details
    const bedrooms = getRandomInt(1, 5);
    const bathrooms = getRandomInt(1, bedrooms + 1);
    const size = getRandomInt(80, 500); // in square meters
    const location = kuwaitLocations[Math.floor(Math.random() * kuwaitLocations.length)];
    
    // Generate a random set of amenities
    const amenitiesCount = getRandomInt(3, 8);
    const amenities = getRandomItems(kuwaitAmenities, amenitiesCount);
    
    // Generate price based on property type and size
    const price = generatePrice(propertyType, size, bedrooms);
    
    // Create a title
    let title;
    if (propertyType === 'apartment' || propertyType === 'penthouse') {
      title = `Luxurious ${bedrooms} Bedroom ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} for Rent in ${location.split(',')[0]}`;
    } else {
      title = `Spacious ${bedrooms} Bedroom ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} for Sale in ${location.split(',')[0]}`;
    }
    
    // Create a description
    let description;
    if (propertyType === 'apartment' || propertyType === 'penthouse') {
      description = `Beautiful ${bedrooms} bedroom ${propertyType} available for rent in ${location}. This modern ${propertyType} features ${bathrooms} bathrooms and spans ${size} square meters of living space. Enjoy amenities including ${amenities.join(', ')}. Perfect for families or professionals looking for a comfortable living space in a prime Kuwait location.`;
    } else {
      description = `Magnificent ${bedrooms} bedroom ${propertyType} for sale in the prestigious area of ${location}. This stunning property offers ${bathrooms} bathrooms and a generous ${size} square meters of living space. Features include ${amenities.join(', ')}. An exceptional opportunity to own a premium property in one of Kuwait's most sought-after neighborhoods.`;
    }
    
    // Download 3 images for this property
    const imageUrls = unsplashUrls[propertyType];
    const propertyImages = [];
    
    for (let j = 0; j < 3; j++) {
      const imageUrl = imageUrls[j % imageUrls.length];
      const filename = `${propertyType}_${i}_${j + 1}.jpg`;
      const filePath = path.join(outputDir, filename);
      
      try {
        await downloadImage(imageUrl, filePath);
        propertyImages.push(`/property_images/${filename}`);
      } catch (error) {
        console.error(`Error downloading image: ${error.message}`);
        // Use a fallback image
        propertyImages.push(`/images/${propertyType}${j + 1}.jpg`);
      }
    }
    
    // Create the property object
    const property = {
      id: `kw-prop-${i}`,
      title,
      description,
      price,
      location,
      property_type: propertyType,
      bedrooms,
      bathrooms,
      size,
      images: propertyImages,
      amenities,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'admin',
    };
    
    properties.push(property);
  }
  
  // Write the properties to a JSON file
  fs.writeFileSync(mockDataFile, JSON.stringify(properties, null, 2));
  console.log(`Generated ${properties.length} Kuwait-specific property listings`);
  console.log(`Mock data saved to: ${mockDataFile}`);
  
  return properties;
}

// Run the script
generateProperties().catch(error => {
  console.error('Error generating properties:', error);
}); 