import React, { Suspense, ReactNode, ComponentType, lazy } from 'react';
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
 * Creates a lazy-loaded component with a property card skeleton fallback
 */
export const lazyPropertyCard = <P extends {}>(importFunc: () => Promise<{ default: ComponentType<P> }>) => {
  const Component = lazy(importFunc);
  return (props: P) => (
    <Suspense fallback={<PropertyCardSkeleton />}>
      <Component {...props as any} />
    </Suspense>
  );
};

/**
 * Creates a lazy-loaded component with a transportation card skeleton fallback
 */
export const lazyTransportationCard = <P extends {}>(importFunc: () => Promise<{ default: ComponentType<P> }>) => {
  const Component = lazy(importFunc);
  return (props: P) => (
    <Suspense fallback={<TransportationCardSkeleton />}>
      <Component {...props as any} />
    </Suspense>
  );
}; 