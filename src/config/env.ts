/**
 * Environment configuration with runtime validation
 * Fails fast during app initialization if required variables are missing
 */

interface EnvConfig {
  apiHost: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Validates a URL string
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Gets and validates environment variables
 * @throws {Error} If required variables are missing or invalid
 */
function validateEnv(): EnvConfig {
  const apiHost = import.meta.env.VITE_API_HOST;
  const isDev = import.meta.env.DEV;
  const mode = import.meta.env.MODE;

  // In production, VITE_API_HOST is required
  if (mode === 'production' && !apiHost) {
    throw new Error(
      'VITE_API_HOST environment variable is required in production. ' +
      'Please set it in your deployment configuration.'
    );
  }

  // Use provided API host or fallback to localhost in dev
  const finalApiHost = apiHost || 'http://localhost:8000';

  // Validate URL format
  if (!isValidUrl(finalApiHost)) {
    throw new Error(
      `Invalid VITE_API_HOST: "${finalApiHost}". ` +
      'Must be a valid HTTP/HTTPS URL (e.g., https://api.example.com)'
    );
  }

  // Warn if using localhost in non-dev mode
  if (!isDev && finalApiHost.includes('localhost')) {
    console.warn(
      '⚠️  Warning: Using localhost API host in non-development mode. ' +
      'This will likely cause API calls to fail.'
    );
  }

  return {
    apiHost: finalApiHost,
    isDevelopment: isDev,
    isProduction: mode === 'production',
  };
}

// Validate and export config
// This throws an error immediately if validation fails
export const env = validateEnv();

// Helper to get full API base URL
export const getApiBaseUrl = () => `${env.apiHost}/api/v1`;
