/**
 * Utility for detecting tier/plan limit errors from the backend.
 *
 * The backend returns limit errors in several shapes:
 * - 400 with `non_field_errors` (DRF serializer validation)
 * - 400 with `error` string (explicit catch in views)
 * - 403 with `error` + `error_code: "TIER_LIMIT_EXCEEDED"` (global exception handler)
 * - 400 with raw list body (ValidationError re-raise)
 *
 * This utility normalizes detection across all shapes.
 */

/**
 * Checks if an API error is a tier/plan limit error.
 */
export function isTierLimitError(error: any): boolean {
  if (!error) return false;

  if (error?.data?.error_code === 'TIER_LIMIT_EXCEEDED') return true;

  const errorMsg = String(error?.data?.error || error?.data?.detail || '');
  const nonFieldError = String(error?.data?.non_field_errors?.[0] || '');
  const combined = `${errorMsg} ${nonFieldError}`.toLowerCase();

  return combined.includes('limit');
}

/**
 * Extracts a clean user-facing message from a tier limit error.
 * Prefers non_field_errors (cleanest from DRF), then error_code responses,
 * then falls back to the provided translation string.
 *
 * Use the fallback for responses where the raw error contains ugly formatting
 * (e.g. Python list string representations from take_action).
 */
export function getTierLimitMessage(error: any, fallback: string): string {
  // non_field_errors are the cleanest backend messages
  if (error?.data?.non_field_errors?.[0]) {
    return error.data.non_field_errors[0];
  }

  // Global exception handler responses have a clean error message
  if (error?.data?.error_code === 'TIER_LIMIT_EXCEEDED' && error?.data?.error) {
    return error.data.error;
  }

  // For other shapes the error string may contain Python list formatting,
  // so prefer the translated fallback
  return fallback;
}
