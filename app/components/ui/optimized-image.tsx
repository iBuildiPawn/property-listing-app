"use client";

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getValidImageUrl, getPlaceholderImage, debugImageUrl, isSupabaseStorageUrl } from '@/app/utils/image-utils';
import { generateBlurPlaceholder } from '@/app/utils/image-optimization';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string | null | undefined;
  alt: string;
  fallbackType?: 'property' | 'transportation' | 'user' | 'default';
  debug?: boolean;
  useLocalFallback?: boolean;
}

/**
 * A wrapper around Next.js Image component with better error handling and fallback support
 */
export default function OptimizedImage({
  src,
  alt,
  fallbackType = 'default',
  debug = false,
  useLocalFallback = true,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [attemptedSupabase, setAttemptedSupabase] = useState(false);
  
  // Get the fallback image based on the type
  const fallbackImage = getPlaceholderImage(fallbackType);
  
  useEffect(() => {
    // Reset error state when src changes
    setError(false);
    setAttemptedSupabase(false);
    
    // Get a valid image URL or use the fallback
    const validSrc = getValidImageUrl(src, fallbackImage);
    setImageSrc(validSrc);
    
    // Debug image URL if debug is enabled
    if (debug) {
      debugImageUrl(src, `OptimizedImage (${alt})`);
    }
  }, [src, fallbackImage, alt, debug]);
  
  const handleError = () => {
    // Log the error
    console.warn(`Image failed to load: ${imageSrc}`);
    
    // If this is a Supabase URL and we haven't tried a local fallback yet
    if (isSupabaseStorageUrl(imageSrc) && !attemptedSupabase && useLocalFallback) {
      // Try to use a local fallback with the same filename
      try {
        const filename = imageSrc.split('/').pop() || '';
        // Extract just the base filename without extension
        const baseFilename = filename.split('.')[0];
        
        // Try to use a local fallback image with the same name
        const localFallback = `/images/${baseFilename}.jpg`;
        console.log(`Trying local fallback: ${localFallback}`);
        
        setAttemptedSupabase(true);
        setImageSrc(localFallback);
        return;
      } catch (e) {
        console.error('Error creating local fallback path:', e);
      }
    }
    
    // If we've already tried a local fallback or it's not a Supabase URL, use the placeholder
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