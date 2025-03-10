import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import PropertyCard from '@/app/components/properties/property-card';

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Test Property',
  description: 'A beautiful test property',
  price: 250000,
  location: 'Test Location',
  property_type: 'house',
  bedrooms: 3,
  bathrooms: 2,
  size: 1500,
  images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
  amenities: ['pool', 'garden'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: 'test-user-id',
};

describe('PropertyCard Component', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    
    // Check if title is rendered
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    
    // Check if location is rendered
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    
    // Check if description is rendered
    expect(screen.getByText('A beautiful test property')).toBeInTheDocument();
    
    // Check if property details are rendered
    expect(screen.getByText('3')).toBeInTheDocument(); // Bedrooms
    expect(screen.getByText('2')).toBeInTheDocument(); // Bathrooms
    expect(screen.getByText('1500 sqft')).toBeInTheDocument(); // Size
    
    // Check if property type is rendered
    expect(screen.getByText('house')).toBeInTheDocument();
    
    // Check if price is rendered correctly (formatted)
    expect(screen.getByText('$250,000')).toBeInTheDocument();
  });
  
  it('calls onToggleFavorite when favorite button is clicked', () => {
    const mockToggleFavorite = jest.fn();
    
    render(
      <PropertyCard 
        property={mockProperty} 
        isFavorite={false} 
        onToggleFavorite={mockToggleFavorite} 
      />
    );
    
    // Find and click the favorite button
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    
    // Check if the onToggleFavorite function was called with the correct property ID
    expect(mockToggleFavorite).toHaveBeenCalledWith('1');
  });
  
  it('displays correct favorite state', () => {
    render(
      <PropertyCard 
        property={mockProperty} 
        isFavorite={true} 
        onToggleFavorite={jest.fn()} 
      />
    );
    
    // Check if the favorite button has the correct label
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });
  
  it('applies custom className when provided', () => {
    const { container } = render(
      <PropertyCard 
        property={mockProperty} 
        className="custom-class" 
      />
    );
    
    // Check if the custom class is applied
    const linkElement = container.querySelector('a');
    expect(linkElement).toHaveClass('custom-class');
  });

  it('formats price differently based on property type', () => {
    // Test with apartment property type
    const apartmentProperty = {
      ...mockProperty,
      property_type: 'apartment',
      price: 2500,
    };
    
    const { container } = render(<PropertyCard property={apartmentProperty} />);
    
    // For apartments, price should be formatted as "$2.5k/mo" or "$2,500/mo"
    // We'll check for the presence of "/mo" since the exact formatting might vary
    const priceElement = container.querySelector('.absolute.bottom-3.left-3');
    expect(priceElement.textContent).toContain('/mo');
    
    // Cleanup
    cleanup();
    
    // Test with condo property type
    const condoProperty = {
      ...mockProperty,
      property_type: 'condo',
      price: 1800,
    };
    
    const { container: container2 } = render(<PropertyCard property={condoProperty} />);
    
    // For condos, price should be formatted as "$1.8k/mo" or "$1,800/mo"
    // We'll check for the presence of "/mo" since the exact formatting might vary
    const priceElement2 = container2.querySelector('.absolute.bottom-3.left-3');
    expect(priceElement2.textContent).toContain('/mo');
  });

  it('handles hover state correctly', () => {
    const { container } = render(<PropertyCard property={mockProperty} />);
    
    // Find the card container
    const cardContainer = container.querySelector('.relative.overflow-hidden.rounded-lg');
    
    // Simulate hover
    fireEvent.mouseEnter(cardContainer);
    
    // Check if the image has the scale-110 class
    const image = container.querySelector('img');
    expect(image).toHaveClass('scale-110');
    
    // Simulate unhover
    fireEvent.mouseLeave(cardContainer);
    
    // Check if the image has the scale-100 class
    expect(image).toHaveClass('scale-100');
  });

  it('handles image error correctly', () => {
    // Mock property with invalid image URL
    const propertyWithInvalidImage = {
      ...mockProperty,
      images: ['invalid-image-url'],
    };
    
    const { container } = render(<PropertyCard property={propertyWithInvalidImage} />);
    
    // Find the image
    const image = container.querySelector('img');
    
    // Simulate image error
    fireEvent.error(image);
    
    // After error, the image source should be the placeholder
    expect(image.getAttribute('src')).toContain('placeholder-property');
  });

  it('renders with index prop for prioritization', () => {
    // Test with index 0 (should prioritize)
    render(<PropertyCard property={mockProperty} index={0} />);
    
    // Test with index 5 (should not prioritize)
    render(<PropertyCard property={mockProperty} index={5} />);
    
    // Both should render without errors
    expect(screen.getAllByText('Test Property').length).toBe(2);
  });
}); 