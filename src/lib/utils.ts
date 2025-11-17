import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds a URL query string from an object of parameters
 * Filters out undefined/null values and converts all values to strings
 *
 * @param params - Object with query parameters
 * @returns Query string (without leading '?') or empty string if no params
 *
 * @example
 * buildQueryString({ page: 1, search: 'test', empty: undefined })
 * // Returns: "page=1&search=test"
 */
export function buildQueryString(
  params: Record<string, unknown> | object
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Skip undefined and null values
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}
