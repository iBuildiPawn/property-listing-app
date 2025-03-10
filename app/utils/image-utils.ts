/**
 * Utility functions for handling images
 */

/**
 * Normalizes a URL by removing duplicate slashes (except in the protocol)
 * @param url The URL to normalize
 * @returns The normalized URL
 */
export const normalizeUrl = (url: string): string => {
  // Don't modify the protocol's double slashes
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Split the URL into protocol and the rest
    const [protocol, ...rest] = url.split('://');
    // Join the rest and replace multiple slashes with a single slash
    const normalizedRest = rest.join('://').replace(/([^:]\/)\/+/g, '$1');
    // Rejoin with the protocol
    return `${protocol}://${normalizedRest}`;
  }
  
  // For non-absolute URLs, just replace multiple slashes with a single slash
  return url.replace(/\/+/g, '/');
};

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
    return normalizeUrl(url);
  }
  
  // If it's a Supabase storage URL that starts with /storage/v1/
  if (url.startsWith('/storage/v1/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    // Remove trailing slash from supabaseUrl if it exists to prevent double slashes
    const cleanSupabaseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
    return normalizeUrl(`${cleanSupabaseUrl}${url}`);
  }
  
  // If it's a relative path starting with /, it's from the public folder
  if (url.startsWith('/')) {
    return url;
  }
  
  // If it's a Supabase storage URL without the leading slash
  if (url.startsWith('storage/v1/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    // Remove trailing slash from supabaseUrl if it exists to prevent double slashes
    const cleanSupabaseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
    return normalizeUrl(`${cleanSupabaseUrl}/${url}`);
  }
  
  // If none of the above, return the fallback
  return fallbackUrl;
};

/**
 * Debug utility to log image URL information to the console
 * @param url The image URL to debug
 * @param label Optional label for the debug output
 */
export const debugImageUrl = (url: string | null | undefined, label = 'Image URL'): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.group(`Debug: ${label}`);
    console.log('Original URL:', url);
    
    if (!url) {
      console.log('Status: Empty or null URL');
      console.groupEnd();
      return;
    }
    
    // Check if it's an absolute URL
    const isAbsolute = url.startsWith('http://') || url.startsWith('https://');
    console.log('Is absolute URL:', isAbsolute);
    
    // Check if it's a Supabase URL
    const isSupabaseUrl = url.includes('storage/v1/') || url.includes('/storage/v1/');
    console.log('Is Supabase storage URL:', isSupabaseUrl);
    
    // Log the Supabase URL from environment if relevant
    if (isSupabaseUrl) {
      console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    }
    
    // Log the transformed URL
    const transformedUrl = getValidImageUrl(url, '/placeholder-image.jpg');
    console.log('Transformed URL:', transformedUrl);
    
    // Check for double slashes
    const hasDoubleSlash = transformedUrl.includes('//') && !transformedUrl.startsWith('http');
    console.log('Contains double slash (excluding protocol):', 
      hasDoubleSlash ? 'Yes - potential issue' : 'No');
    
    // Show normalized URL
    const normalizedUrl = normalizeUrl(url);
    console.log('Normalized URL:', normalizedUrl);
    
    console.groupEnd();
  }
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