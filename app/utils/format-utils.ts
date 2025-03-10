/**
 * Utility functions for formatting data in the application
 */

/**
 * Formats a price value to a localized currency string
 * @param price - The price value to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns A formatted price string
 */
export function formatPrice(
  price: number | string | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (price === null || price === undefined || price === '') {
    return 'Price not available';
  }

  // Convert string to number if needed
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Check if the conversion resulted in a valid number
  if (isNaN(numericPrice)) {
    return 'Invalid price';
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${numericPrice} ${currency}`;
  }
}

/**
 * Formats a date to a localized string
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns A formatted date string
 */
export function formatDate(
  date: Date | string | null | undefined,
  locale: string = 'en-US'
): string {
  if (!date) {
    return 'Date not available';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * Formats a number with commas for thousands
 * @param num - The number to format
 * @returns A formatted number string
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined || num === '') {
    return '0';
  }

  const numericValue = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(numericValue)) {
    return '0';
  }

  return numericValue.toLocaleString();
}

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 * @param str - The string to truncate
 * @param maxLength - The maximum length (default: 100)
 * @returns A truncated string
 */
export function truncateString(
  str: string | null | undefined,
  maxLength: number = 100
): string {
  if (!str) {
    return '';
  }

  if (str.length <= maxLength) {
    return str;
  }

  return `${str.substring(0, maxLength)}...`;
} 