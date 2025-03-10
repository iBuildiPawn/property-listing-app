"use client";

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getValidImageUrl, getPlaceholderImage, debugImageUrl } from '@/app/utils/image-utils';
import { generateBlurPlaceholder } from '@/app/utils/image-optimization';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string | null | undefined;
  alt: string;
  fallbackType?: 'property' | 'transportation' | 'user' | 'default';
  debug?: boolean;
}

/**
 * A wrapper around Next.js Image component with better error handling and fallback support
 */
export default function OptimizedImage({
  src,
  alt,
  fallbackType = 'default',
  debug = false,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  
  // Get the fallback image based on the type
  const fallbackImage = getPlaceholderImage(fallbackType);
  
  useEffect(() => {
    // Reset error state when src changes
    setError(false);
    
    // Get a valid image URL or use the fallback
    const validSrc = getValidImageUrl(src, fallbackImage);
    setImageSrc(validSrc);
    
    // Debug image URL if debug is enabled
    if (debug) {
      debugImageUrl(src, `OptimizedImage (${alt})`);
    }
  }, [src, fallbackImage, alt, debug]);
  
  const handleError = () => {
    console.warn(`Image failed to load: ${imageSrc}`);
    setError(true);
    setImageSrc(fallbackImage);
  };
  
  return (
    <Image
      src={error ? fallbackImage : imageSrc}
      alt={alt}
      onError={handleError}
      placeholder="blur"
      blurDataURL={generateBlurPlaceholder()}
      {...props}
    />
  );
} 