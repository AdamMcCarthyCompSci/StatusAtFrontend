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

/**
 * Formats a date string as relative time (e.g., "2 days ago", "5 minutes ago")
 *
 * @param dateString - ISO date string to format
 * @returns Relative time string or 'Unknown' if invalid
 *
 * @example
 * formatRelativeTime('2025-01-13T10:00:00Z')
 * // Returns: "2 hours ago" (if current time is 12:00:00)
 */
export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Unknown';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Future dates
    if (diffInSeconds < 0) {
      return 'just now';
    }

    // Less than a minute
    if (diffInSeconds < 60) {
      return 'just now';
    }

    // Minutes
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    // Hours
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    // Days
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    // Months
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }

    // Years
    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  } catch {
    return 'Unknown';
  }
}
