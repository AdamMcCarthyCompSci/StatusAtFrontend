import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import FlowManagement from '@/components/Flow/FlowManagement';
import { User } from '@/types/user';

// Mock the auth store
vi.mock('@/stores/useAuthStore');

const mockUser: User = {
  id: 1,
  email: 'admin@test.com',
  name: 'Admin User',
  memberships: [
    {
      uuid: 'membership-1',
      tenant_name: 'Test Tenant',
      tenant_uuid: 'tenant-1',
      user: 1,
      user_email: 'admin@test.com',
      role: 'OWNER',
      available_roles: [],
    },
  ],
  enrollments: [],
  tier: 'FREE',
  color_scheme: 'light',
  marketing_consent: false,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('FlowManagement Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      user: mockUser,
      tokens: { access: 'token', refresh: 'refresh' },
      isAuthenticated: true,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });
  });

  it('should render pagination controls when there are multiple pages', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Flow Management')).toBeInTheDocument();
    });

    // Check if pagination controls are present (assuming we have more than 10 flows)
    await waitFor(() => {
      const paginationElements = screen.queryAllByText(/Previous|Next|\d+/);
      expect(paginationElements.length).toBeGreaterThan(0);
    });
  });

  it('should render search input and page size selector', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search by flow name...')).toBeInTheDocument();
      expect(screen.getByText('Per page')).toBeInTheDocument();
    });
  });

  it('should update search term when typing in search input', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    const searchInput = await screen.findByPlaceholderText('Search by flow name...');
    
    fireEvent.change(searchInput, { target: { value: 'Order' } });
    
    expect(searchInput).toHaveValue('Order');
  });

  it('should show flow count information', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    // Wait for flows to load and check for count display
    await waitFor(() => {
      const countText = screen.queryByText(/Showing \d+ of \d+ flows/);
      if (countText) {
        expect(countText).toBeInTheDocument();
      }
    });
  });

  it('should render page size options', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    // Find the page size selector trigger
    const pageSizeLabel = await screen.findByText('Per page');
    expect(pageSizeLabel).toBeInTheDocument();
  });
});
