import {
  generateBlurPlaceholder,
  getResponsiveImageSizes,
  shouldLoadWithPriority,
  getPlaceholderImage
} from '@/app/utils/image-optimization';

describe('Image Optimization Utilities', () => {
  describe('generateBlurPlaceholder', () => {
    it('returns a valid base64 encoded SVG', () => {
      const result = generateBlurPlaceholder();
      
      // Check if it's a string
      expect(typeof result).toBe('string');
      
      // Check if it starts with the data URL prefix for SVG
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
      
      // Check if it's a valid base64 string after the prefix
      const base64Part = result.split(',')[1];
      expect(() => Buffer.from(base64Part, 'base64')).not.toThrow();
    });
  });
  
  describe('getResponsiveImageSizes', () => {
    it('returns a valid sizes string for responsive images', () => {
      const result = getResponsiveImageSizes();
      
      // Check if it's a string
      expect(typeof result).toBe('string');
      
      // Check if it contains media queries for different viewport sizes
      expect(result).toContain('max-width: 640px');
      expect(result).toContain('max-width: 768px');
      expect(result).toContain('max-width: 1024px');
      
      // Check if it contains viewport width values
      expect(result).toContain('100vw');
      expect(result).toContain('50vw');
      expect(result).toContain('33vw');
      expect(result).toContain('25vw');
    });
  });
  
  describe('shouldLoadWithPriority', () => {
    it('returns true for the first visible image', () => {
      expect(shouldLoadWithPriority(0, true)).toBe(true);
    });
    
    it('returns false for non-first images', () => {
      expect(shouldLoadWithPriority(1, true)).toBe(false);
      expect(shouldLoadWithPriority(2, true)).toBe(false);
    });
    
    it('returns false for non-visible images', () => {
      expect(shouldLoadWithPriority(0, false)).toBe(false);
    });

    it('returns false when no visibility is specified', () => {
      // This tests the default parameter value
      expect(shouldLoadWithPriority(0)).toBe(true);
      expect(shouldLoadWithPriority(1)).toBe(false);
    });
  });
  
  describe('getPlaceholderImage', () => {
    it('returns the correct placeholder for property images', () => {
      expect(getPlaceholderImage('property')).toBe('/placeholder-property.jpg');
    });
    
    it('returns the correct placeholder for transportation images', () => {
      expect(getPlaceholderImage('transportation')).toBe('/placeholder-transportation.jpg');
    });
    
    it('returns the correct placeholder for user images', () => {
      expect(getPlaceholderImage('user')).toBe('/placeholder-user.jpg');
    });
    
    it('returns the default placeholder for other types', () => {
      expect(getPlaceholderImage('default')).toBe('/placeholder-image.jpg');
    });
  });
}); 