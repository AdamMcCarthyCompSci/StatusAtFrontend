/**
 * Application-wide constants
 * Centralized configuration for consistent values across the codebase
 */

/**
 * Cache time configurations for React Query
 *
 * @property STALE_TIME - Time before data is considered stale and refetch is triggered
 * @property CACHE_TIME - Time before unused data is garbage collected from cache
 */
export const CACHE_TIMES = {
  /** 5 minutes - Standard stale time for most queries */
  STALE_TIME: 5 * 60 * 1000,

  /** 10 minutes - Cache time before garbage collection */
  CACHE_TIME: 10 * 60 * 1000,

  /** 1 minute - For frequently changing data */
  STALE_TIME_SHORT: 1 * 60 * 1000,

  /** 15 minutes - For rarely changing data */
  STALE_TIME_LONG: 15 * 60 * 1000,
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  /** Default timeout for API requests in milliseconds */
  DEFAULT_TIMEOUT: 30 * 1000, // 30 seconds

  /** Maximum number of retry attempts for failed requests */
  MAX_RETRIES: 3,

  /** Delay between retry attempts in milliseconds */
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  /** Default page size for lists */
  DEFAULT_PAGE_SIZE: 10,

  /** Available page size options */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
} as const;
