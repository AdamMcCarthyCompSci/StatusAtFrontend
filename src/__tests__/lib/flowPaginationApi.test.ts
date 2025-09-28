import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/handlers';
import { flowApi } from '@/lib/api';

// Setup MSW server
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Flow Pagination API', () => {
  const tenantUuid = '4c892c79-e212-4189-a8de-8e3df52fc461';

  it('should fetch flows with default pagination', async () => {
    const response = await flowApi.getFlows(tenantUuid);
    
    expect(response).toHaveProperty('count');
    expect(response).toHaveProperty('results');
    expect(response).toHaveProperty('next');
    expect(response).toHaveProperty('previous');
    expect(Array.isArray(response.results)).toBe(true);
    expect(response.count).toBeGreaterThan(0);
  });

  it('should fetch flows with custom page size', async () => {
    const response = await flowApi.getFlows(tenantUuid, { page_size: 5 });
    
    expect(response.results.length).toBeLessThanOrEqual(5);
    expect(response.count).toBeGreaterThan(0);
  });

  it('should fetch flows with pagination parameters', async () => {
    const response = await flowApi.getFlows(tenantUuid, { 
      page: 1, 
      page_size: 3 
    });
    
    expect(response.results.length).toBeLessThanOrEqual(3);
    if (response.count > 3) {
      expect(response.next).toBeTruthy();
    }
    expect(response.previous).toBeNull();
  });

  it('should fetch second page of flows', async () => {
    const response = await flowApi.getFlows(tenantUuid, { 
      page: 2, 
      page_size: 5 
    });
    
    expect(response).toHaveProperty('results');
    if (response.count > 5) {
      expect(response.previous).toBeTruthy();
    }
  });

  it('should search flows by name', async () => {
    const response = await flowApi.getFlows(tenantUuid, { 
      search: 'Order' 
    });
    
    expect(response).toHaveProperty('results');
    // Check if all results contain the search term
    response.results.forEach(flow => {
      expect(flow.name.toLowerCase()).toContain('order');
    });
  });

  it('should return empty results for non-existent search', async () => {
    const response = await flowApi.getFlows(tenantUuid, { 
      search: 'NonExistentFlow' 
    });
    
    expect(response.results).toHaveLength(0);
    expect(response.count).toBe(0);
  });

  it('should combine search and pagination', async () => {
    const response = await flowApi.getFlows(tenantUuid, { 
      search: 'Processing',
      page: 1,
      page_size: 2
    });
    
    expect(response).toHaveProperty('results');
    expect(response.results.length).toBeLessThanOrEqual(2);
    response.results.forEach(flow => {
      expect(flow.name.toLowerCase()).toContain('processing');
    });
  });

  it('should handle invalid tenant UUID', async () => {
    const response = await flowApi.getFlows('invalid-tenant-uuid');
    
    expect(response.results).toHaveLength(0);
    expect(response.count).toBe(0);
  });

  it('should generate correct next/previous URLs', async () => {
    const response = await flowApi.getFlows(tenantUuid, { 
      page: 2, 
      page_size: 3 
    });
    
    if (response.next) {
      expect(response.next).toContain('page=3');
      expect(response.next).toContain('page_size=3');
    }
    
    if (response.previous) {
      expect(response.previous).toContain('page=1');
      expect(response.previous).toContain('page_size=3');
    }
  });
});
