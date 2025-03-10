import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { 
  LazyComponent,
  lazyPropertyCard,
  lazyTransportationCard
} from '@/app/components/ui/lazy-component';

// Mock the React.Suspense component
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    Suspense: ({ children, fallback }) => (
      <div data-testid="suspense-boundary">
        <div data-testid="suspense-fallback">{fallback}</div>
        <div data-testid="suspense-children">{children}</div>
      </div>
    ),
    lazy: (importFn) => {
      const Component = (props) => <div>Lazy Component</div>;
      return Component;
    }
  };
});

describe('Lazy Component Utilities', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  describe('LazyComponent', () => {
    it('renders children within a Suspense boundary', () => {
      const { getByTestId } = render(
        <LazyComponent>
          <div>Test Content</div>
        </LazyComponent>
      );
      
      // Check if the Suspense boundary is rendered
      expect(getByTestId('suspense-boundary')).toBeInTheDocument();
      
      // Check if the children are rendered
      const children = getByTestId('suspense-children');
      expect(children).toBeInTheDocument();
      expect(children.textContent).toContain('Test Content');
    });
    
    it('renders with a default fallback when none is provided', () => {
      const { getByTestId } = render(
        <LazyComponent>
          <div>Test Content</div>
        </LazyComponent>
      );
      
      // Check if the fallback is rendered
      const fallback = getByTestId('suspense-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback.firstChild).toHaveClass('animate-pulse');
    });
    
    it('renders with a custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Loading...</div>;
      
      const { getByTestId } = render(
        <LazyComponent fallback={customFallback}>
          <div>Test Content</div>
        </LazyComponent>
      );
      
      // Check if the custom fallback is rendered
      const fallback = getByTestId('suspense-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback.textContent).toContain('Loading...');
    });
  });
  
  describe('lazyPropertyCard', () => {
    it('returns a component that renders within a Suspense boundary', () => {
      const importFunc = jest.fn(() => Promise.resolve({ default: () => <div>Property Card</div> }));
      const LazyPropertyCard = lazyPropertyCard(importFunc);
      
      const { getByTestId } = render(<LazyPropertyCard />);
      
      // Check if the Suspense boundary is rendered
      expect(getByTestId('suspense-boundary')).toBeInTheDocument();
    });
  });
  
  describe('lazyTransportationCard', () => {
    it('returns a component that renders within a Suspense boundary', () => {
      const importFunc = jest.fn(() => Promise.resolve({ default: () => <div>Transportation Card</div> }));
      const LazyTransportationCard = lazyTransportationCard(importFunc);
      
      const { getByTestId } = render(<LazyTransportationCard />);
      
      // Check if the Suspense boundary is rendered
      expect(getByTestId('suspense-boundary')).toBeInTheDocument();
    });
  });
}); 