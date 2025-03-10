"use client";

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { getValidImageUrl, getPlaceholderImage } from '@/app/utils/image-utils';
import { generateBlurPlaceholder } from '@/app/utils/image-optimization';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string | null | undefined;
  alt: string;
  fallbackType?: 'property' | 'transportation' | 'user' | 'default';
}

/**
 * A wrapper around Next.js Image component with better error handling and fallback support
 */
export default function OptimizedImage({
  src,
  alt,
  fallbackType = 'default',
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  
  // Get the fallback image based on the type
  const fallbackImage = getPlaceholderImage(fallbackType);
  
  // Get a valid image URL or use the fallback
  const validSrc = !error ? getValidImageUrl(src, fallbackImage) : fallbackImage;
  
  return (
    <Image
      src={validSrc}
      alt={alt}
      onError={() => setError(true)}
      placeholder="blur"
      blurDataURL={generateBlurPlaceholder()}
      {...props}
    />
  );
} 