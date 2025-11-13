import { describe, it, expect } from 'vitest';

import { buildQueryString } from '@/lib/utils';

describe('buildQueryString', () => {
  it('should build query string from object with all defined values', () => {
    const params = {
      page: 1,
      search: 'test',
      filter: 'active',
    };

    const result = buildQueryString(params);
    expect(result).toBe('page=1&search=test&filter=active');
  });

  it('should skip undefined values', () => {
    const params = {
      page: 1,
      search: undefined,
      filter: 'active',
    };

    const result = buildQueryString(params);
    expect(result).toBe('page=1&filter=active');
  });

  it('should skip null values', () => {
    const params = {
      page: 1,
      search: null,
      filter: 'active',
    };

    const result = buildQueryString(params);
    expect(result).toBe('page=1&filter=active');
  });

  it('should handle boolean values', () => {
    const params = {
      is_active: true,
      is_deleted: false,
    };

    const result = buildQueryString(params);
    expect(result).toBe('is_active=true&is_deleted=false');
  });

  it('should handle number values', () => {
    const params = {
      page: 1,
      page_size: 25,
      count: 0,
    };

    const result = buildQueryString(params);
    expect(result).toBe('page=1&page_size=25&count=0');
  });

  it('should return empty string for empty object', () => {
    const result = buildQueryString({});
    expect(result).toBe('');
  });

  it('should return empty string when all values are undefined', () => {
    const params = {
      page: undefined,
      search: undefined,
    };

    const result = buildQueryString(params);
    expect(result).toBe('');
  });

  it('should URL encode special characters', () => {
    const params = {
      search: 'test search',
      email: 'user@example.com',
    };

    const result = buildQueryString(params);
    expect(result).toBe('search=test+search&email=user%40example.com');
  });

  it('should handle mixed types correctly', () => {
    const params = {
      page: 1,
      search: 'test',
      is_active: true,
      empty: undefined,
      nothing: null,
    };

    const result = buildQueryString(params);
    expect(result).toBe('page=1&search=test&is_active=true');
  });
});
