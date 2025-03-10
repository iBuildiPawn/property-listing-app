import { Suspense, ReactNode, ComponentType, lazy, LazyExoticComponent } from 'react';
import { PropertyCardSkeleton, TransportationCardSkeleton } from './loading-skeleton';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A wrapper component that provides a Suspense boundary with a fallback loading state
 */
export function LazyComponent({ children, fallback }: LazyComponentProps) {
  return (
    <Suspense fallback={fallback || <div className="animate-pulse h-8 w-full bg-muted rounded-md" />}>
      {children}
    </Suspense>
  );
}

/**
 * Creates a lazy-loaded property card component
 * @param importFunc - The import function for the component
 * @returns A lazy-loaded component with a property card skeleton fallback
 */
export function lazyPropertyCard<T>(
  importFunc: () => Promise<{ default: ComponentType<T> }>
): LazyExoticComponent<ComponentType<T>> {
  const LazyComponent = lazy(importFunc);
  
  // Create a wrapper component with the appropriate fallback
  const WrappedComponent = (props: T) => (
    <Suspense fallback={<PropertyCardSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  // Cast to LazyExoticComponent to maintain type compatibility
  return WrappedComponent as unknown as LazyExoticComponent<ComponentType<T>>;
}

/**
 * Creates a lazy-loaded transportation card component
 * @param importFunc - The import function for the component
 * @returns A lazy-loaded component with a transportation card skeleton fallback
 */
export function lazyTransportationCard<T>(
  importFunc: () => Promise<{ default: ComponentType<T> }>
): LazyExoticComponent<ComponentType<T>> {
  const LazyComponent = lazy(importFunc);
  
  // Create a wrapper component with the appropriate fallback
  const WrappedComponent = (props: T) => (
    <Suspense fallback={<TransportationCardSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  // Cast to LazyExoticComponent to maintain type compatibility
  return WrappedComponent as unknown as LazyExoticComponent<ComponentType<T>>;
} 