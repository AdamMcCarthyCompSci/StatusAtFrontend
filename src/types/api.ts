export interface ApiResponse<T = any> {
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
  body?: any;
  contentType?: string;
  redirect?: boolean;
  authenticate?: boolean;
}
