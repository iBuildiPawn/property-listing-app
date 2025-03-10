/**
 * Generates a blur data URL for placeholder images
 * @returns A base64 encoded SVG that can be used as a placeholder
 */
export function generateBlurPlaceholder(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=';
}

/**
 * Determines the appropriate image size based on the viewport
 * @returns A sizes string for the Next.js Image component
 */
export function getResponsiveImageSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
}

/**
 * Optimizes image loading by determining if an image should be loaded with priority
 * @param index The index of the image in a list
 * @param isVisible Whether the image is visible in the viewport
 * @returns Whether the image should be loaded with priority
 */
export function shouldLoadWithPriority(index: number, isVisible = true): boolean {
  // Load the first visible image with priority
  return index === 0 && isVisible;
}

/**
 * Generates a placeholder image URL based on the image type
 * @param type The type of image (property, transportation, etc.)
 * @returns A placeholder image URL
 */
export function getPlaceholderImage(type: 'property' | 'transportation' | 'user' | 'default'): string {
  switch (type) {
    case 'property':
      return '/placeholder-property.jpg';
    case 'transportation':
      return '/placeholder-transportation.jpg';
    case 'user':
      return '/placeholder-user.jpg';
    default:
      return '/placeholder-image.jpg';
  }
} 