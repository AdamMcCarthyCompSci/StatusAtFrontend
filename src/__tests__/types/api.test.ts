import { describe, it, expect } from 'vitest';
import { ApiError } from '@/types/api';

describe('ApiError', () => {
  it('should create an ApiError with message only', () => {
    const error = new ApiError('Test error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('Test error');
    expect(error.data).toBeUndefined();
    expect(error.status).toBeUndefined();
  });

  it('should create an ApiError with message and data', () => {
    const errorData = {
      detail: 'Detailed error message',
      code: 'error_code',
    };
    const error = new ApiError('Test error', errorData);

    expect(error.message).toBe('Test error');
    expect(error.data).toEqual(errorData);
    expect(error.data?.detail).toBe('Detailed error message');
    expect(error.data?.code).toBe('error_code');
    expect(error.status).toBeUndefined();
  });

  it('should create an ApiError with message, data, and status', () => {
    const errorData = {
      detail: 'Not found',
      code: 'not_found',
    };
    const error = new ApiError('Resource not found', errorData, 404);

    expect(error.message).toBe('Resource not found');
    expect(error.data).toEqual(errorData);
    expect(error.status).toBe(404);
  });

  it('should have proper error name', () => {
    const error = new ApiError('Test');
    expect(error.name).toBe('ApiError');
  });

  it('should be catchable as Error', () => {
    try {
      throw new ApiError('Test error', { detail: 'Details' }, 500);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      if (error instanceof ApiError) {
        expect(error.message).toBe('Test error');
        expect(error.status).toBe(500);
      }
    }
  });

  it('should support additional error data properties', () => {
    const errorData = {
      detail: 'Error detail',
      code: 'custom_error',
      field: 'username',
      customProperty: 'custom value',
    };
    const error = new ApiError('Validation error', errorData, 400);

    expect(error.data?.detail).toBe('Error detail');
    expect(error.data?.code).toBe('custom_error');
    expect(error.data?.field).toBe('username');
    expect(error.data?.customProperty).toBe('custom value');
  });

  it('should maintain stack trace', () => {
    const error = new ApiError('Test error');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('ApiError');
  });

  it('should handle different HTTP status codes', () => {
    const error400 = new ApiError('Bad request', undefined, 400);
    const error401 = new ApiError('Unauthorized', undefined, 401);
    const error404 = new ApiError('Not found', undefined, 404);
    const error500 = new ApiError('Server error', undefined, 500);

    expect(error400.status).toBe(400);
    expect(error401.status).toBe(401);
    expect(error404.status).toBe(404);
    expect(error500.status).toBe(500);
  });

  it('should work with instanceof checks', () => {
    const regularError = new Error('Regular error');
    const apiError = new ApiError('API error');

    expect(regularError instanceof ApiError).toBe(false);
    expect(apiError instanceof ApiError).toBe(true);
    expect(apiError instanceof Error).toBe(true);
  });
});
