"use client";

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/app/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallbackSrc?: string;
  aspectRatio?: string;
  containerClassName?: string;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder-image.jpg',
  aspectRatio = 'aspect-[16/9]',
  containerClassName,
  className,
  fill,
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [src]);

  // Handle image loading
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Handle image error
  const handleError = () => {
    setError(true);
    setIsLoading(false);
    setCurrentSrc(fallbackSrc);
  };

  // Determine the source to use
  const imageSrc = error ? fallbackSrc : (src || fallbackSrc);

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        !fill && aspectRatio,
        containerClassName
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}
    </div>
  );
} 