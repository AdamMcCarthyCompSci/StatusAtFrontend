import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import AccountSettings from '@/components/Account/AccountSettings';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { useSoleOwnership } from '@/hooks/useSoleOwnership';

// Mock the stores
vi.mock('@/stores/useAuthStore');
vi.mock('@/stores/useAppStore');

// Mock the user mutation hooks
vi.mock('@/hooks/useUserMutation', () => ({
  useUpdateUser: vi.fn(),
  useDeleteUser: vi.fn(),
}));

// Mock the sole ownership hook
vi.mock('@/hooks/useSoleOwnership', () => ({
  useSoleOwnership: vi.fn(),
}));

// Mock the notification preferences hook
vi.mock('@/hooks/useNotificationPreferencesQuery', () => ({
  useNotificationPreferencesQuery: vi.fn(),
  useUpdateNotificationPreferences: vi.fn(),
}));

// Mock react-international-phone
vi.mock('react-international-phone', () => ({
  PhoneInput: ({ value, onChange }: any) => (
    <input
      data-testid="phone-input"
      value={value}
      onChange={(e) => {
        // Simulate the component's behavior with metadata
        onChange(e.target.value, {
          country: { iso2: 'de', dialCode: '49' }
        });
      }}
    />
  ),
  defaultCountries: [
    ['Germany', 'de', '49'],
    ['United States', 'us', '1'],
  ],
  parseCountry: (country: any) => ({
    name: country[0],
    iso2: country[1],
    dialCode: country[2],
  }),
}));

// Mock the ConfirmationProvider
const MockConfirmationProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const mockUseAuthStore = vi.mocked(useAuthStore);
const mockUseAppStore = vi.mocked(useAppStore);
const mockUseSoleOwnership = vi.mocked(useSoleOwnership);

const createWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MockConfirmationProvider>
          {children}
        </MockConfirmationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const mockUser = {
  id: 2,
  email: 'admin@admin.com',
  name: 'Admin User',
  memberships: [
    {
      uuid: 'membership-1',
      tenant_name: 'Test Tenant 1',
      tenant_uuid: 'tenant-1',
      user: 2,
      user_name: 'Admin User',
      user_email: 'admin@admin.com',
      role: 'OWNER' as const,
      available_roles: []
    }
  ],
  enrollments: [],
  color_scheme: 'light' as const,
  marketing_consent: true,
  whatsapp_country_code: undefined,
  whatsapp_phone_number: undefined,
};

describe('AccountSettings', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      tokens: null,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });

    mockUseAppStore.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      sidebarOpen: false,
      setSidebarOpen: vi.fn(),
      toggleSidebar: vi.fn(),
      isOnline: true,
      setIsOnline: vi.fn(),
    });

    mockUseSoleOwnership.mockReturnValue({
      soleOwnerships: [mockUser.memberships[0]], // Mock as sole owner for the test
      isLoading: false,
      hasError: false,
      ownerMemberships: mockUser.memberships,
    });

    // Mock the user mutation hooks
    const userMutationHooks = await import('@/hooks/useUserMutation');
    
    vi.mocked(userMutationHooks.useUpdateUser).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    vi.mocked(userMutationHooks.useDeleteUser).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    // Mock the notification preferences hooks
    const notificationHooks = await import('@/hooks/useNotificationPreferencesQuery');
    
    vi.mocked(notificationHooks.useNotificationPreferencesQuery).mockReturnValue({
      data: {
        email_enabled: true,
        email_status_updates: true,
        email_invites: true,
        whatsapp_enabled: false,
        whatsapp_status_updates: false,
        whatsapp_invites: false,
      },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(notificationHooks.useUpdateNotificationPreferences).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);
  });

  it('renders account settings interface', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your account preferences and settings')).toBeInTheDocument();
  });

  it('displays profile information section', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Admin User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('admin@admin.com')).toBeInTheDocument();
  });

  it('displays appearance settings section', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('displays account management section with delete warning when sole owner', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Account Management')).toBeInTheDocument();
    expect(screen.getAllByText('Delete Account')).toHaveLength(2); // Header and button
    expect(screen.getByText(/Warning: You are the sole owner/)).toBeInTheDocument();
  });

  it('displays account management section without warning when not sole owner', () => {
    // Mock as not being a sole owner
    mockUseSoleOwnership.mockReturnValue({
      soleOwnerships: [], // No sole ownerships
      isLoading: false,
      hasError: false,
      ownerMemberships: mockUser.memberships,
    });

    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Account Management')).toBeInTheDocument();
    expect(screen.getAllByText('Delete Account')).toHaveLength(2); // Header and button
    expect(screen.queryByText(/Warning: You are the sole owner/)).not.toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    const nameInput = screen.getByDisplayValue('Admin User');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    expect(nameInput).toHaveValue('Updated Name');
  });

  it('shows save button when changes are made', async () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    const nameInput = screen.getByDisplayValue('Admin User');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    await waitFor(() => {
      const saveButton = screen.getByText('Save Profile');
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('handles marketing consent toggle', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    const marketingSwitch = screen.getByRole('switch', { name: /marketing communications/i });
    expect(marketingSwitch).toBeChecked();

    fireEvent.click(marketingSwitch);
    expect(marketingSwitch).not.toBeChecked();
  });


  it('renders sign-in message when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      tokens: null,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });

    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Please sign in to access account settings.')).toBeInTheDocument();
  });

  describe('Phone Number Functionality', () => {
    it('displays phone input field', () => {
      render(<AccountSettings />, { wrapper: createWrapper });
      expect(screen.getByTestId('phone-input')).toBeInTheDocument();
    });

    it('populates phone field when user has a phone number', () => {
      const userWithPhone = {
        ...mockUser,
        whatsapp_country_code: '+49',
        whatsapp_phone_number: '16093162276',
      };

      mockUseAuthStore.mockReturnValue({
        user: userWithPhone,
        isAuthenticated: true,
        tokens: null,
        setTokens: vi.fn(),
        setUser: vi.fn(),
        clearTokens: vi.fn(),
      });

      render(<AccountSettings />, { wrapper: createWrapper });
      
      const phoneInput = screen.getByTestId('phone-input');
      expect(phoneInput).toHaveValue('+49 16093162276');
    });

    it('allows user to add a phone number', async () => {
      const updateUserMock = vi.fn().mockResolvedValue({});
      const userMutationHooks = await import('@/hooks/useUserMutation');
      vi.mocked(userMutationHooks.useUpdateUser).mockReturnValue({
        mutateAsync: updateUserMock,
        isPending: false,
      } as any);

      render(<AccountSettings />, { wrapper: createWrapper });

      const phoneInput = screen.getByTestId('phone-input');
      fireEvent.change(phoneInput, { target: { value: '+4916093162276' } });

      await waitFor(() => {
        const saveButton = screen.getByText('Save Profile');
        expect(saveButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByText('Save Profile'));

      await waitFor(() => {
        expect(updateUserMock).toHaveBeenCalledWith({
          userId: mockUser.id,
          userData: expect.objectContaining({
            whatsapp_country_code: '+49',
            whatsapp_phone_number: '16093162276',
          }),
        });
      });
    });

    it('disables WhatsApp notifications when phone number is removed', async () => {
      const userWithPhone = {
        ...mockUser,
        whatsapp_country_code: '+49',
        whatsapp_phone_number: '16093162276',
      };

      mockUseAuthStore.mockReturnValue({
        user: userWithPhone,
        isAuthenticated: true,
        tokens: null,
        setTokens: vi.fn(),
        setUser: vi.fn(),
        clearTokens: vi.fn(),
      });

      const updateUserMock = vi.fn().mockResolvedValue({});
      const updateNotificationsMock = vi.fn().mockResolvedValue({});
      
      const userMutationHooks = await import('@/hooks/useUserMutation');
      const notificationHooks = await import('@/hooks/useNotificationPreferencesQuery');
      
      vi.mocked(userMutationHooks.useUpdateUser).mockReturnValue({
        mutateAsync: updateUserMock,
        isPending: false,
      } as any);

      vi.mocked(notificationHooks.useUpdateNotificationPreferences).mockReturnValue({
        mutateAsync: updateNotificationsMock,
        isPending: false,
      } as any);

      render(<AccountSettings />, { wrapper: createWrapper });

      const phoneInput = screen.getByTestId('phone-input');
      fireEvent.change(phoneInput, { target: { value: '' } });

      await waitFor(() => {
        const saveButton = screen.getByText('Save Profile');
        expect(saveButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByText('Save Profile'));

      await waitFor(() => {
        // Should update user with null phone fields
        expect(updateUserMock).toHaveBeenCalledWith({
          userId: userWithPhone.id,
          userData: expect.objectContaining({
            whatsapp_country_code: null,
            whatsapp_phone_number: null,
          }),
        });

        // Should disable WhatsApp notifications
        expect(updateNotificationsMock).toHaveBeenCalledWith({
          whatsapp_enabled: false,
          whatsapp_status_updates: false,
          whatsapp_invites: false,
        });
      });
    });

    it('correctly parses phone number with country code', async () => {
      const updateUserMock = vi.fn().mockResolvedValue({});
      const userMutationHooks = await import('@/hooks/useUserMutation');
      vi.mocked(userMutationHooks.useUpdateUser).mockReturnValue({
        mutateAsync: updateUserMock,
        isPending: false,
      } as any);

      render(<AccountSettings />, { wrapper: createWrapper });

      const phoneInput = screen.getByTestId('phone-input');
      // Simulate input with spaces (formatted)
      fireEvent.change(phoneInput, { target: { value: '+49 160 93162276' } });

      await waitFor(() => {
        const saveButton = screen.getByText('Save Profile');
        expect(saveButton).not.toBeDisabled();
      });

      fireEvent.click(screen.getByText('Save Profile'));

      await waitFor(() => {
        expect(updateUserMock).toHaveBeenCalledWith({
          userId: mockUser.id,
          userData: expect.objectContaining({
            whatsapp_country_code: '+49',
            whatsapp_phone_number: '16093162276', // Should have spaces removed
          }),
        });
      });
    });
  });
});
