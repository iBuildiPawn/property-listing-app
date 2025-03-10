import React from 'react';
import { render } from '@testing-library/react';
import { dynamicImport, dynamicImportWithPreload } from '@/app/utils/dynamic-import';

// Mock component to be dynamically imported
const MockComponent = () => <div>Mock Component</div>;

// Mock the next/dynamic module
jest.mock('next/dynamic', () => {
  return jest.fn((importFunc, options) => {
    const Component = () => {
      const LoadingComponent = options?.loading;
      return LoadingComponent ? <LoadingComponent /> : <MockComponent />;
    };
    
    if (options?.ssr) {
      Component.displayName = 'SSRMockComponent';
    } else {
      Component.displayName = 'ClientMockComponent';
    }
    
    return Component;
  });
});

describe('Dynamic Import Utilities', () => {
  describe('dynamicImport', () => {
    it('returns a dynamically imported component', () => {
      const importFunc = jest.fn(() => Promise.resolve({ default: MockComponent }));
      const DynamicComponent = dynamicImport(importFunc);
      
      const { container } = render(<DynamicComponent />);
      expect(container).toBeInTheDocument();
    });
    
    it('uses the provided loading component', () => {
      const importFunc = jest.fn(() => Promise.resolve({ default: MockComponent }));
      const LoadingComponent = () => <div>Loading...</div>;
      const DynamicComponent = dynamicImport(importFunc, LoadingComponent);
      
      const { container } = render(<DynamicComponent />);
      expect(container).toBeInTheDocument();
    });
    
    it('respects the SSR option', () => {
      const importFunc = jest.fn(() => Promise.resolve({ default: MockComponent }));
      const DynamicComponent = dynamicImport(importFunc, undefined, true);
      
      expect(DynamicComponent.displayName).toBe('SSRMockComponent');
    });
  });
  
  describe('dynamicImportWithPreload', () => {
    it('returns a dynamically imported component with preload method', () => {
      const importFunc = jest.fn(() => Promise.resolve({ default: MockComponent }));
      const DynamicComponent = dynamicImportWithPreload(importFunc);
      
      const { container } = render(<DynamicComponent />);
      expect(container).toBeInTheDocument();
      
      // Check if preload method exists and is the import function
      expect(typeof (DynamicComponent as any).preload).toBe('function');
      expect((DynamicComponent as any).preload).toBe(importFunc);
    });
    
    it('uses the provided loading component', () => {
      const importFunc = jest.fn(() => Promise.resolve({ default: MockComponent }));
      const LoadingComponent = () => <div>Loading...</div>;
      const DynamicComponent = dynamicImportWithPreload(importFunc, LoadingComponent);
      
      const { container } = render(<DynamicComponent />);
      expect(container).toBeInTheDocument();
    });
    
    it('respects the SSR option', () => {
      const importFunc = jest.fn(() => Promise.resolve({ default: MockComponent }));
      const DynamicComponent = dynamicImportWithPreload(importFunc, undefined, true);
      
      expect(DynamicComponent.displayName).toBe('SSRMockComponent');
    });
  });
}); 