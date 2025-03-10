/**
 * Utility functions for handling images
 */

/**
 * Validates and transforms image URLs to ensure they work correctly
 * @param url The original image URL
 * @param fallbackUrl The fallback URL to use if the original is invalid
 * @returns A valid image URL
 */
export const getValidImageUrl = (url: string | null | undefined, fallbackUrl: string): string => {
  if (!url) return fallbackUrl;
  
  // If it's already a valid absolute URL, use it directly
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a Supabase storage URL that starts with /storage/v1/
  if (url.startsWith('/storage/v1/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    return `${supabaseUrl}${url}`;
  }
  
  // If it's a relative path starting with /, it's from the public folder
  if (url.startsWith('/')) {
    return url;
  }
  
  // If it's a Supabase storage URL without the leading slash
  if (url.startsWith('storage/v1/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    return `${supabaseUrl}/${url}`;
  }
  
  // If none of the above, return the fallback
  return fallbackUrl;
};

/**
 * Gets a placeholder image for a specific type
 * @param type The type of placeholder (property, transportation, etc.)
 * @returns The URL to the placeholder image
 */
export const getPlaceholderImage = (type: 'property' | 'transportation' | 'user' | 'default' | string): string => {
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
}; 