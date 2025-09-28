import { http, HttpResponse } from 'msw';
import { User } from '../types/user';

const API_BASE_URL = 'http://localhost:8000'; // Use fixed URL for tests

// Mock user data
const mockUser: User = {
  id: 2,
  email: 'admin@admin.com',
  name: 'admin',
  memberships: [
    {
      uuid: '533ebc46-e9c2-4098-8639-7a447bb77682',
      tenant_name: 'Test Tenant 1',
      user: 2,
      user_email: 'admin@admin.com',
      role: 'OWNER',
      available_roles: []
    }
  ],
  enrollments: [
    {
      uuid: 'dfb7baac-0211-49c8-9504-84aca1e1e2c4',
      flow_name: 'Test Flow 1',
      flow_uuid: '4a70e82a-ef88-4e12-998b-2e15ee087066',
      tenant_name: 'Test Tenant 1',
      tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
      current_step_name: 'Test Step 1',
      current_step_uuid: 'efe18a82-0f4d-4adb-afb5-c6f44860f857',
      created_at: '2025-09-28T11:08:40.696773Z'
    }
  ],
  tier: 'FREE',
  color_scheme: 'light',
  marketing_consent: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock customer-only user
const mockCustomerUser: User = {
  id: 3,
  email: 'customer@example.com',
  name: 'Customer User',
  memberships: [],
  enrollments: [
    {
      uuid: 'customer-enrollment-1',
      flow_name: 'Order Processing',
      flow_uuid: 'flow-uuid-1',
      tenant_name: 'Test Tenant 1',
      tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
      current_step_name: 'Processing Payment',
      current_step_uuid: 'step-uuid-1',
      created_at: '2025-09-28T10:00:00.000Z'
    },
    {
      uuid: 'customer-enrollment-2',
      flow_name: 'Shipping Status',
      flow_uuid: 'flow-uuid-2',
      tenant_name: 'Test Tenant 1',
      tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
      current_step_name: 'In Transit',
      current_step_uuid: 'step-uuid-2',
      created_at: '2025-09-27T15:30:00.000Z'
    }
  ],
  tier: 'FREE',
  color_scheme: 'light',
  marketing_consent: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const handlers = [
  // Get current user
  http.get(`${API_BASE_URL}/user/me`, ({ request }) => {
    // Check authorization header to determine which user to return
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.includes('customer_token')) {
      return HttpResponse.json(mockCustomerUser);
    }
    return HttpResponse.json(mockUser);
  }),

  // Update user
  http.patch(`${API_BASE_URL}/user/me`, async ({ request }) => {
    const updates = await request.json() as Partial<User>;
    const updatedUser = { ...mockUser, ...updates };
    return HttpResponse.json(updatedUser);
  }),

  // Auth endpoints
  http.post(`${API_BASE_URL}/token`, async ({ request }) => {
    const { email, password } = await request.json();
    if (email === 'admin@admin.com' && password === 'password123') {
      return HttpResponse.json({ access: 'admin_access_token', refresh: 'admin_refresh_token' });
    }
    if (email === 'customer@example.com' && password === 'password123') {
      return HttpResponse.json({ access: 'customer_token', refresh: 'customer_refresh_token' });
    }
    return HttpResponse.json({ detail: 'Invalid credentials' }, { status: 401 });
  }),

  http.post(`${API_BASE_URL}/token/refresh`, () => {
    return HttpResponse.json({
      access: 'new-access-token',
      refresh: 'new-refresh-token',
    });
  }),

  // User registration
  http.post(`${API_BASE_URL}/user`, async ({ request }) => {
      const { name, email, password } = await request.json();
    if (name && email && password) {
      return HttpResponse.json({ 
        id: '2', 
        name, 
        email, 
        color_scheme: 'light',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { status: 201 });
    }
    return HttpResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }),

  // Password reset
  http.post(`${API_BASE_URL}/user/reset_password`, async ({ request }) => {
    const { email } = await request.json();
    if (email === 'test@example.com') {
      return HttpResponse.json({ message: 'Password reset email sent.' }, { status: 200 });
    }
    return HttpResponse.json({ detail: 'User not found' }, { status: 404 });
  }),

  // Email confirmation
  http.post(`${API_BASE_URL}/user/confirm_email`, async ({ request }) => {
    const { token } = await request.json();
    if (token === 'valid-token') {
      return HttpResponse.json({ message: 'Email confirmed successfully.', success: true }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Invalid or expired token.', success: false }, { status: 400 });
  }),

  // Request confirmation email
  http.post(`${API_BASE_URL}/user/request_confirmation_email`, async ({ request }) => {
    const { email } = await request.json();
    if (email) {
      return HttpResponse.json({ message: 'Confirmation email sent.' }, { status: 200 });
    }
    return HttpResponse.json({ detail: 'Email is required' }, { status: 400 });
  }),

  // Handle authentication errors
  http.get(`${API_BASE_URL}/protected-endpoint`, () => {
    return new HttpResponse(null, { status: 401 });
  }),
];
