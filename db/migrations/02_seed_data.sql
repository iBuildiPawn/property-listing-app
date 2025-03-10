-- Seed properties data
INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, size, amenities, images, is_available)
VALUES
  (
    'Modern Downtown Apartment',
    'A beautiful modern apartment in the heart of downtown. Features high ceilings, large windows, and modern appliances.',
    1800,
    'Downtown, Metropolis',
    'apartment',
    2,
    1,
    850,
    ARRAY['Air Conditioning', 'Dishwasher', 'Washer/Dryer', 'Gym', 'Pool'],
    ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
    TRUE
  ),
  (
    'Spacious Family Home',
    'A spacious family home in a quiet suburban neighborhood. Perfect for families with children, featuring a large backyard and proximity to schools.',
    350000,
    'Oakwood Suburb, Metropolis',
    'house',
    4,
    2.5,
    2200,
    ARRAY['Central Heating', 'Air Conditioning', 'Garage', 'Fireplace', 'Garden'],
    ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be'],
    TRUE
  ),
  (
    'Luxury Waterfront Condo',
    'Stunning luxury condo with panoramic water views. Features high-end finishes, floor-to-ceiling windows, and a private balcony.',
    750000,
    'Harbor View, Metropolis',
    'condo',
    3,
    2,
    1800,
    ARRAY['Doorman', 'Elevator', 'Gym', 'Pool', 'Concierge', 'Parking'],
    ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
    TRUE
  ),
  (
    'Cozy Studio Apartment',
    'Cozy studio apartment perfect for students or young professionals. Located near universities and public transportation.',
    950,
    'University District, Metropolis',
    'apartment',
    0,
    1,
    450,
    ARRAY['Air Conditioning', 'Furnished', 'Laundry in Building', 'Internet Included'],
    ARRAY['https://images.unsplash.com/photo-1554995207-c18c203602cb', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9'],
    TRUE
  ),
  (
    'Modern Townhouse',
    'Modern townhouse with contemporary design and energy-efficient features. Located in a vibrant neighborhood with easy access to shops and restaurants.',
    425000,
    'Greenfield, Metropolis',
    'townhouse',
    3,
    2.5,
    1650,
    ARRAY['Central Heating', 'Air Conditioning', 'Garage', 'Patio', 'Energy Efficient'],
    ARRAY['https://images.unsplash.com/photo-1576941089067-2de3c901e126', 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7'],
    TRUE
  ),
  (
    'Investment Land Opportunity',
    'Prime land for development in a rapidly growing area. Great investment opportunity with high potential returns.',
    200000,
    'Growth Corridor, Metropolis',
    'land',
    0,
    0,
    10000,
    ARRAY['Utilities Available', 'Road Access', 'Zoned for Mixed Use'],
    ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef', 'https://images.unsplash.com/photo-1500076656116-558758c991c1'],
    TRUE
  );

-- Seed transportation services data
INSERT INTO transportation_services (name, description, service_type, price_range, location, contact_info, website, images, is_available)
VALUES
  (
    'Metro Movers',
    'Professional moving service with experienced staff and modern equipment. We handle local and long-distance moves with care.',
    'moving',
    'medium',
    'Metropolis',
    'contact@metromovers.com | (555) 123-4567',
    'https://www.metromovers.com',
    ARRAY['https://images.unsplash.com/photo-1603664454146-50b9bb1e7afa', 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b'],
    TRUE
  ),
  (
    'City Ride',
    'On-demand ride-sharing service available 24/7. Quick pickups and affordable rates for getting around the city.',
    'ride_sharing',
    'low',
    'Metropolis',
    'support@cityride.com | (555) 234-5678',
    'https://www.cityride.com',
    ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2', 'https://images.unsplash.com/photo-1590513977333-eaa50a3abd13'],
    TRUE
  ),
  (
    'Metropolis Transit Authority',
    'Public transportation network including buses, subway, and light rail. Comprehensive coverage throughout the metropolitan area.',
    'public_transport',
    'low',
    'Metropolis',
    'info@metropolistransit.gov | (555) 345-6789',
    'https://www.metropolistransit.gov',
    ARRAY['https://images.unsplash.com/photo-1556122071-e404eaedb77f', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'],
    TRUE
  ),
  (
    'Luxury Auto Rentals',
    'Premium car rental service featuring luxury and exotic vehicles. Make a statement with our high-end fleet.',
    'car_rental',
    'high',
    'Metropolis',
    'reservations@luxuryautorentals.com | (555) 456-7890',
    'https://www.luxuryautorentals.com',
    ARRAY['https://images.unsplash.com/photo-1550355291-bbee04a92027', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d'],
    TRUE
  ),
  (
    'Budget Car Rental',
    'Affordable car rental options for every need. Economy, compact, and family vehicles at competitive rates.',
    'car_rental',
    'medium',
    'Metropolis',
    'info@budgetcarrental.com | (555) 567-8901',
    'https://www.budgetcarrental.com',
    ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'],
    TRUE
  ),
  (
    'Express Movers',
    'Fast and efficient moving services for residential and commercial clients. Specializing in same-day and emergency moves.',
    'moving',
    'medium',
    'Metropolis',
    'bookings@expressmovers.com | (555) 678-9012',
    'https://www.expressmovers.com',
    ARRAY['https://images.unsplash.com/photo-1586864387789-628af9feed72', 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b'],
    TRUE
  ); 