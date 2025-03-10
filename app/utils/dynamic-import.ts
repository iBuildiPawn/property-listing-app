import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Dynamically imports a component with loading state
 * @param importFunc - The import function
 * @param LoadingComponent - Optional loading component to show while the component is loading
 * @param ssr - Whether to render the component on the server (default: false)
 * @returns The dynamically imported component
 */
export function dynamicImport<T>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  LoadingComponent?: ComponentType,
  ssr = false
) {
  return dynamic(importFunc, {
    loading: LoadingComponent,
    ssr,
  });
}

/**
 * Dynamically imports a component with loading state and preloads it
 * @param importFunc - The import function
 * @param LoadingComponent - Optional loading component to show while the component is loading
 * @param ssr - Whether to render the component on the server (default: false)
 * @returns The dynamically imported component with preload method
 */
export function dynamicImportWithPreload<T>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  LoadingComponent?: ComponentType,
  ssr = false
) {
  const DynamicComponent = dynamic(importFunc, {
    loading: LoadingComponent,
    ssr,
  });

  // Add preload method
  (DynamicComponent as any).preload = importFunc;

  return DynamicComponent;
} 