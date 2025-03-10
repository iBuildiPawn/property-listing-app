import { cn } from '@/app/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/50',
        className
      )}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      {/* Image skeleton */}
      <div className="relative h-48 w-full sm:h-52 md:h-48 lg:h-52">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-3 sm:p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        
        <div className="border-t border-border pt-3 sm:pt-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3 sm:space-x-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransportationCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      {/* Image skeleton */}
      <div className="relative h-48 w-full sm:h-52 md:h-48 lg:h-52">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-3 sm:p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        
        <div className="border-t border-border pt-3 sm:pt-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6, type = 'property' }: { count?: number; type?: 'property' | 'transportation' }) {
  const SkeletonComponent = type === 'property' ? PropertyCardSkeleton : TransportationCardSkeleton;
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
} 