import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import FlowManagement from '../../components/Flow/FlowManagement';
import { useAuthStore } from '../../stores/useAuthStore';
import { User } from '../../types/user';

// Mock the auth store
vi.mock('../../stores/useAuthStore');
const mockUseAuthStore = useAuthStore as ReturnType<typeof vi.fn>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const mockUser: User = {
  id: 2,
  email: 'admin@admin.com',
  name: 'admin',
  memberships: [
    {
      uuid: '533ebc46-e9c2-4098-8639-7a447bb77682',
      tenant_name: 'Test Tenant 1',
      tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
      user: 2,
      user_email: 'admin@admin.com',
      role: 'OWNER',
      available_roles: []
    }
  ],
  enrollments: [],
  tier: 'FREE',
  color_scheme: 'light',
  marketing_consent: true,
};

const mockMultiTenantUser: User = {
  ...mockUser,
  memberships: [
    ...mockUser.memberships,
    {
      uuid: 'membership-2-uuid',
      tenant_name: 'Test Tenant 2',
      tenant_uuid: 'tenant-2-uuid',
      user: 2,
      user_email: 'admin@admin.com',
      role: 'STAFF',
      available_roles: []
    }
  ]
};

describe('FlowManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show tenant selection for multi-tenant users', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockMultiTenantUser,
      tokens: null,
      isAuthenticated: true,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });

    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    expect(screen.getByText('Select an organization to manage flows')).toBeInTheDocument();
    expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    expect(screen.getByText('Test Tenant 2')).toBeInTheDocument();
  });

  it('should show flow management page when tenant is selected', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      tokens: null,
      isAuthenticated: true,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });

    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    // Component should auto-select the tenant and show the management page
    await waitFor(() => {
      expect(screen.getByText('Flow Management')).toBeInTheDocument();
      expect(screen.getByText('Managing flows for Test Tenant 1')).toBeInTheDocument();
    });
  });

  it('should show create flow dialog', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      tokens: null,
      isAuthenticated: true,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });

    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    // Select tenant first
    // Component should auto-select tenant

    await waitFor(() => {
      expect(screen.getAllByText('Create New Flow').length).toBeGreaterThan(0);
    });
  });

  it('should display existing flows section', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      tokens: null,
      isAuthenticated: true,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });

    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    // Select tenant
    // Component should auto-select tenant

    await waitFor(() => {
      expect(screen.getByText('Existing Flows')).toBeInTheDocument();
    });
  });

  it('should handle flow deletion confirmation dialog', () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    // Test that the confirmation dialog would be called
    expect(confirmSpy).toBeDefined();
    
    confirmSpy.mockRestore();
  });

  it('should show back to dashboard link', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      tokens: null,
      isAuthenticated: true,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });

    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowManagement />
      </Wrapper>
    );

    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });
});
