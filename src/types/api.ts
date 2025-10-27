export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  contentType?: string;
  redirect?: boolean;
  authenticate?: boolean;
}

// API Error types
export interface ApiErrorData {
  detail?: string;
  message?: string;
  code?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  public data?: ApiErrorData;
  public status?: number;

  constructor(message: string, data?: ApiErrorData, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.data = data;
    this.status = status;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

// Location state types for React Router
export interface LocationStateWithEmail {
  email?: string;
  message?: string;
}

export interface LocationStateWithInvite extends LocationStateWithEmail {
  fromInviteSignup?: boolean;
  flowInvite?: {
    tenantName: string;
    flowName: string;
  };
}
