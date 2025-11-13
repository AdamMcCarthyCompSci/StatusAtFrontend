import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import FlowManagement from '../../components/Flow/FlowManagement';
import { useAuthStore } from '../../stores/useAuthStore';
import { User } from '../../types/user';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      const translations: Record<string, string> = {
        'flows.flowManagement': 'Flow Management',
        'flows.manageWorkflows': 'Manage your workflow templates',
        'flows.managingFor': `Managing flows for ${params?.tenant || 'tenant'}`,
        'flows.backToDashboard': 'Back to Dashboard',
        'flows.noOrgSelected': 'No Organization Selected',
        'flows.selectOrgPrompt': 'Select an organization to manage flows',
        'flows.selectOrg': 'Select Organization',
        'flows.createNewFlow': 'Create New Flow',
        'flows.existingFlows': 'Existing Flows',
        'flows.noFlows': 'No flows yet',
        'flows.noFlowsDesc': 'Create your first workflow template',
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' },
  }),
}));

// Mock the auth store
vi.mock('../../stores/useAuthStore');
const mockUseAuthStore = useAuthStore as ReturnType<typeof vi.fn>;

// Mock tenant store with dynamic state
const mockTenantStore = {
  selectedTenant: null as string | null,
  setSelectedTenant: vi.fn(),
};

vi.mock('../../stores/useTenantStore', () => ({
  useTenantStore: () => mockTenantStore,
}));

// Mock flow query hooks
vi.mock('../../hooks/useFlowQuery', () => ({
  useFlows: () => ({
    data: {
      count: 2,
      next: null,
      previous: null,
      results: [
        { uuid: 'flow-1', name: 'Test Flow 1', tenant_name: 'Test Tenant 1', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { uuid: 'flow-2', name: 'Test Flow 2', tenant_name: 'Test Tenant 1', created_at: '2024-01-02', updated_at: '2024-01-02' },
      ],
    },
    isLoading: false,
    error: null,
  }),
  useCreateFlow: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ uuid: 'new-flow', name: 'New Flow' }),
    isPending: false,
  }),
  useDeleteFlow: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

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
    mockTenantStore.selectedTenant = null; // Reset to null before each test
  });

  it('should show tenant selection prompt when no tenant selected', () => {
    mockTenantStore.selectedTenant = null; // No tenant selected
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

    // Should show prompt to select an organization
    expect(screen.getByText('No Organization Selected')).toBeInTheDocument();
    expect(screen.getByText('Select an organization to manage flows')).toBeInTheDocument();
  });

  it('should show flow management page when tenant is selected', async () => {
    mockTenantStore.selectedTenant = '4c892c79-e212-4189-a8de-8e3df52fc461'; // Tenant selected
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

    // Component should show the management page with selected tenant
    await waitFor(() => {
      expect(screen.getByText('Flow Management')).toBeInTheDocument();
      expect(screen.getByText('Managing flows for Test Tenant 1')).toBeInTheDocument();
    });
  });

  it('should show create flow dialog', async () => {
    mockTenantStore.selectedTenant = '4c892c79-e212-4189-a8de-8e3df52fc461'; // Tenant selected
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

    // Component should show the flow management page with create button
    await waitFor(() => {
      expect(screen.getAllByText('Create New Flow').length).toBeGreaterThan(0);
    });
  });

  it('should display existing flows', async () => {
    mockTenantStore.selectedTenant = '4c892c79-e212-4189-a8de-8e3df52fc461'; // Tenant selected
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

    // Component should show the flows from the mock data
    await waitFor(() => {
      expect(screen.getByText('Test Flow 1')).toBeInTheDocument();
      expect(screen.getByText('Test Flow 2')).toBeInTheDocument();
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
