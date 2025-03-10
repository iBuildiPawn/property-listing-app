import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { 
  Skeleton, 
  PropertyCardSkeleton, 
  TransportationCardSkeleton,
  CardGridSkeleton 
} from '@/app/components/ui/loading-skeleton';

describe('Loading Skeleton Components', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  describe('Skeleton', () => {
    it('renders with default classes', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild;
      
      expect(skeleton).toHaveClass('animate-pulse');
      expect(skeleton).toHaveClass('rounded-md');
      expect(skeleton).toHaveClass('bg-muted/50');
    });
    
    it('applies custom className when provided', () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const skeleton = container.firstChild;
      
      expect(skeleton).toHaveClass('custom-class');
    });
  });
  
  describe('PropertyCardSkeleton', () => {
    it('renders the property card skeleton structure', () => {
      const { container } = render(<PropertyCardSkeleton />);
      
      // Check if the main container has the correct classes
      const cardContainer = container.firstChild;
      expect(cardContainer).toHaveClass('relative');
      expect(cardContainer).toHaveClass('overflow-hidden');
      expect(cardContainer).toHaveClass('rounded-lg');
      expect(cardContainer).toHaveClass('border');
      expect(cardContainer).toHaveClass('bg-card');
      
      // Check if it has an image skeleton
      const imageSkeleton = container.querySelector('.relative.h-48');
      expect(imageSkeleton).toBeInTheDocument();
      
      // Check if it has content skeletons
      const contentSkeletons = container.querySelectorAll('.h-4, .h-6');
      expect(contentSkeletons.length).toBeGreaterThan(0);
    });
  });
  
  describe('TransportationCardSkeleton', () => {
    it('renders the transportation card skeleton structure', () => {
      const { container } = render(<TransportationCardSkeleton />);
      
      // Check if the main container has the correct classes
      const cardContainer = container.firstChild;
      expect(cardContainer).toHaveClass('relative');
      expect(cardContainer).toHaveClass('overflow-hidden');
      expect(cardContainer).toHaveClass('rounded-lg');
      expect(cardContainer).toHaveClass('border');
      expect(cardContainer).toHaveClass('bg-card');
      
      // Check if it has an image skeleton
      const imageSkeleton = container.querySelector('.relative.h-48');
      expect(imageSkeleton).toBeInTheDocument();
      
      // Check if it has content skeletons
      const contentSkeletons = container.querySelectorAll('.h-4, .h-6');
      expect(contentSkeletons.length).toBeGreaterThan(0);
    });
  });
  
  describe('CardGridSkeleton', () => {
    it('renders the default number of property card skeletons', () => {
      const { container } = render(<CardGridSkeleton />);
      
      // Check if it renders a grid
      const grid = container.firstChild;
      expect(grid).toHaveClass('grid');
      
      // Check if it renders skeletons
      const skeletons = container.querySelectorAll('.relative.overflow-hidden.rounded-lg');
      expect(skeletons.length).toBeGreaterThan(0);
    });
    
    it('renders the specified number of property card skeletons', () => {
      const { container } = render(<CardGridSkeleton count={3} />);
      
      // Check if it renders skeletons
      const skeletons = container.querySelectorAll('.relative.overflow-hidden.rounded-lg');
      expect(skeletons.length).toBe(3);
    });
    
    it('renders transportation card skeletons when specified', () => {
      const { container } = render(<CardGridSkeleton type="transportation" count={2} />);
      
      // Check if it renders skeletons
      const skeletons = container.querySelectorAll('.relative.overflow-hidden.rounded-lg');
      expect(skeletons.length).toBe(2);
    });
  });
}); 