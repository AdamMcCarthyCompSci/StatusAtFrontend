import { http, HttpResponse } from 'msw';

import { User, Enrollment as UserEnrollment } from '../types/user';
import { Flow } from '../types/flow';
import { Member } from '../types/member';
import { Enrollment, FlowWithSteps } from '../types/enrollment';
import { logger } from '../lib/logger';
import { PAGINATION } from '../config/constants';

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Use fixed URL with API versioning for tests

// Mock user data
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
      user_name: 'admin',
      user_email: 'admin@admin.com',
      role: 'OWNER',
      available_roles: [],
    },
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
      created_at: '2025-09-28T11:08:40.696773Z',
    },
  ],
  color_scheme: 'light',
  has_usable_password: true,
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
      created_at: '2025-09-28T10:00:00.000Z',
    },
    {
      uuid: 'customer-enrollment-2',
      flow_name: 'Shipping Status',
      flow_uuid: 'flow-uuid-2',
      tenant_name: 'Test Tenant 1',
      tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
      current_step_name: 'In Transit',
      current_step_uuid: 'step-uuid-2',
      created_at: '2025-09-27T15:30:00.000Z',
    },
  ],
  color_scheme: 'light',
  has_usable_password: true,
  marketing_consent: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock flow data - expanded for pagination testing
const mockFlows: Flow[] = [
  {
    uuid: 'flow-1-uuid',
    name: 'Order Processing',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-01T00:00:00Z',
    modified: '2024-01-01T00:00:00Z',
  },
  {
    uuid: 'flow-2-uuid',
    name: 'Support Ticket',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-02T00:00:00Z',
    modified: '2024-01-02T00:00:00Z',
  },
  {
    uuid: 'flow-3-uuid',
    name: 'Customer Onboarding',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-03T00:00:00Z',
    modified: '2024-01-03T00:00:00Z',
  },
  {
    uuid: 'flow-4-uuid',
    name: 'Product Return',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-04T00:00:00Z',
    modified: '2024-01-04T00:00:00Z',
  },
  {
    uuid: 'flow-5-uuid',
    name: 'Shipping Tracking',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-05T00:00:00Z',
    modified: '2024-01-05T00:00:00Z',
  },
  {
    uuid: 'flow-6-uuid',
    name: 'Payment Processing',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-06T00:00:00Z',
    modified: '2024-01-06T00:00:00Z',
  },
  {
    uuid: 'flow-7-uuid',
    name: 'Account Verification',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-07T00:00:00Z',
    modified: '2024-01-07T00:00:00Z',
  },
  {
    uuid: 'flow-8-uuid',
    name: 'Subscription Management',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-08T00:00:00Z',
    modified: '2024-01-08T00:00:00Z',
  },
  {
    uuid: 'flow-9-uuid',
    name: 'Refund Request',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-09T00:00:00Z',
    modified: '2024-01-09T00:00:00Z',
  },
  {
    uuid: 'flow-10-uuid',
    name: 'Quality Assurance',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-10T00:00:00Z',
    modified: '2024-01-10T00:00:00Z',
  },
  {
    uuid: 'flow-11-uuid',
    name: 'Inventory Management',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-11T00:00:00Z',
    modified: '2024-01-11T00:00:00Z',
  },
  {
    uuid: 'flow-12-uuid',
    name: 'Marketing Campaign',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    created: '2024-01-12T00:00:00Z',
    modified: '2024-01-12T00:00:00Z',
  },
];

// Mock member data - expanded for pagination testing
const mockMembers: Member[] = [
  {
    uuid: '533ebc46-e9c2-4098-8639-7a447bb77682',
    user_id: 2,
    user_name: 'admin',
    user_email: 'admin@admin.com',
    role: 'OWNER',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    tenant_name: 'Test Tenant 1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    uuid: 'member-2-uuid',
    user_id: 3,
    user_name: 'John Smith',
    user_email: 'john.smith@example.com',
    role: 'OWNER',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    tenant_name: 'Test Tenant 1',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    uuid: 'member-3-uuid',
    user_id: 4,
    user_name: 'Sarah Johnson',
    user_email: 'sarah.johnson@example.com',
    role: 'STAFF',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    tenant_name: 'Test Tenant 1',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
  {
    uuid: 'member-4-uuid',
    user_id: 5,
    user_name: 'Mike Wilson',
    user_email: 'mike.wilson@example.com',
    role: 'MEMBER',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    tenant_name: 'Test Tenant 1',
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
  {
    uuid: 'member-5-uuid',
    user_id: 6,
    user_name: 'Emily Davis',
    user_email: 'emily.davis@example.com',
    role: 'MEMBER',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    tenant_name: 'Test Tenant 1',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
  },
  {
    uuid: 'member-6-uuid',
    user_id: 7,
    user_name: 'David Brown',
    user_email: 'david.brown@example.com',
    role: 'MEMBER',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    tenant_name: 'Test Tenant 1',
    created_at: '2024-01-06T00:00:00Z',
    updated_at: '2024-01-06T00:00:00Z',
  },
];

// Mock enrollment data
const mockEnrollments: Enrollment[] = [
  {
    uuid: 'enrollment-1',
    user_id: 4,
    user_name: 'Alice Johnson',
    user_email: 'alice@example.com',
    flow_name: 'Order Processing',
    flow_uuid: 'flow-1-uuid',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    current_step_name: 'Initial Review',
    current_step_uuid: 'step-1',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T14:20:00Z',
  },
  {
    uuid: 'enrollment-2',
    user_id: 5,
    user_name: 'Bob Wilson',
    user_email: 'bob@example.com',
    flow_name: 'Order Processing',
    flow_uuid: 'flow-1-uuid',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    current_step_name: 'In Progress',
    current_step_uuid: 'step-2',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-18T11:45:00Z',
  },
  {
    uuid: 'enrollment-3',
    user_id: 6,
    user_name: 'Carol Davis',
    user_email: 'carol@example.com',
    flow_name: 'Support Ticket',
    flow_uuid: 'flow-2-uuid',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    current_step_name: 'Shipped',
    current_step_uuid: 'step-6',
    created_at: '2024-01-12T16:00:00Z',
    updated_at: '2024-01-19T08:30:00Z',
  },
  {
    uuid: 'enrollment-4',
    user_id: 7,
    user_name: 'David Brown',
    user_email: 'david@example.com',
    flow_name: 'Support Ticket',
    flow_uuid: 'flow-2-uuid',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    current_step_name: 'Processing',
    current_step_uuid: 'step-5',
    created_at: '2024-01-20T12:00:00Z',
    updated_at: '2024-01-20T12:00:00Z',
  },
];

// Mock tenant data
const mockTenants = [
  {
    uuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
    name: 'Test Tenant 1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock flows with steps for filtering
const mockFlowsWithSteps: FlowWithSteps[] = [
  {
    uuid: 'flow-1-uuid',
    name: 'Order Processing',
    steps: [
      { uuid: 'step-1', name: 'Initial Review' },
      { uuid: 'step-2', name: 'In Progress' },
      { uuid: 'step-3', name: 'Final Review' },
      { uuid: 'step-4', name: 'Completed' },
    ],
  },
  {
    uuid: 'flow-2-uuid',
    name: 'Support Ticket',
    steps: [
      { uuid: 'step-5', name: 'Processing' },
      { uuid: 'step-6', name: 'Shipped' },
      { uuid: 'step-7', name: 'Delivered' },
    ],
  },
];

// In-memory storage for created flows, members, and enrollments (for demo purposes)
let createdFlows: Flow[] = [...mockFlows];
let createdMembers: Member[] = [...mockMembers];
let createdEnrollments: Enrollment[] = [...mockEnrollments];

export const handlers = [
  // User Account Management Endpoints
  http.patch(`${API_BASE_URL}/user/:userId`, async ({ params, request }) => {
    const { userId } = params;
    const updates = (await request.json()) as Partial<User>;

    // Determine which user to update based on ID
    let targetUser: User;
    if (userId === '2') {
      targetUser = mockUser;
    } else if (userId === '3') {
      targetUser = mockCustomerUser;
    } else {
      return new HttpResponse(null, { status: 404 });
    }

    // Update the mock user data
    Object.assign(targetUser, updates);

    return HttpResponse.json(targetUser);
  }),

  http.delete(`${API_BASE_URL}/user/:userId`, ({ params: _params }) => {
    // In a real app, this would delete the user from the database
    // For now, just return success
    return new HttpResponse(null, { status: 204 });
  }),

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
    const updates = (await request.json()) as Partial<User>;
    const updatedUser = { ...mockUser, ...updates };
    return HttpResponse.json(updatedUser);
  }),

  // Auth endpoints
  http.post(`${API_BASE_URL}/token`, async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    if (email === 'admin@admin.com' && password === 'password123') {
      return HttpResponse.json({
        access: 'admin_access_token',
        refresh: 'admin_refresh_token',
      });
    }
    if (email === 'customer@example.com' && password === 'password123') {
      return HttpResponse.json({
        access: 'customer_token',
        refresh: 'customer_refresh_token',
      });
    }
    return HttpResponse.json(
      { detail: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE_URL}/token/refresh`, () => {
    return HttpResponse.json({
      access: 'new-access-token',
      refresh: 'new-refresh-token',
    });
  }),

  // User registration
  http.post(`${API_BASE_URL}/user`, async ({ request }) => {
    const { name, email, password, invite_token, marketing_consent } =
      (await request.json()) as {
        name: string;
        email: string;
        password: string;
        invite_token?: string;
        marketing_consent?: boolean;
      };
    if (name && email && password) {
      // If registering with an invite token, user is automatically confirmed
      const isConfirmed = !!invite_token;

      // Base user data
      const userData = {
        id: 25,
        name,
        email,
        color_scheme: 'light',
        has_usable_password: true,
        is_confirmed: isConfirmed,
        marketing_consent: marketing_consent || false,
        memberships: [],
        enrollments: [] as UserEnrollment[],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // If it's a flow enrollment invite, add enrollment data
      if (invite_token === 'flow-invite-token-123') {
        userData.enrollments = [
          {
            uuid: 'enrollment-uuid',
            flow_name: 'Project Approval Process',
            flow_uuid: 'flow-uuid-here',
            tenant_name: 'Acme Corporation',
            tenant_uuid: 'tenant-uuid',
            current_step_name: 'Initial Step',
            current_step_uuid: 'step-uuid-1',
            created_at: new Date().toISOString(),
          },
        ];
      }

      return HttpResponse.json(userData, { status: 201 });
    }
    return HttpResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }),

  // Password reset
  http.post(`${API_BASE_URL}/user/reset_password`, async ({ request }) => {
    const { email } = (await request.json()) as { email: string };
    if (email === 'test@example.com') {
      return HttpResponse.json(
        { message: 'Password reset email sent.' },
        { status: 200 }
      );
    }
    return HttpResponse.json({ detail: 'User not found' }, { status: 404 });
  }),

  // Email confirmation
  http.post(`${API_BASE_URL}/user/confirm_email`, async ({ request }) => {
    const { token } = (await request.json()) as { token: string };
    if (token === 'valid-token') {
      return HttpResponse.json(
        { message: 'Email confirmed successfully.', success: true },
        { status: 200 }
      );
    }
    return HttpResponse.json(
      { message: 'Invalid or expired token.', success: false },
      { status: 400 }
    );
  }),

  // Request confirmation email
  http.post(
    `${API_BASE_URL}/user/request_confirmation_email`,
    async ({ request }) => {
      const { email } = (await request.json()) as { email: string };
      if (email) {
        return HttpResponse.json(
          { message: 'Confirmation email sent.' },
          { status: 200 }
        );
      }
      return HttpResponse.json(
        { detail: 'Email is required' },
        { status: 400 }
      );
    }
  ),

  // Validate invite token
  http.get(`${API_BASE_URL}/invite/validate/:token`, ({ params }) => {
    const { token } = params;

    // Tenant member invite
    if (token === '208ab182-657c-44d2-b968-06470ce2a359') {
      return HttpResponse.json({
        valid: true,
        invite: {
          uuid: '1f39b5d2-220b-402d-ab2b-370fccc57e45',
          email: 'adammcc@gmail.com',
          invite_type: 'tenant_member',
          status: 'pending',
          tenant: 'f377d1ea-b992-424c-92bc-c8c666f7c7bf',
          tenant_name: 'Test Tenant 1',
          flow: null,
          flow_name: null,
          role: 'MEMBER',
          expires_at: '2025-10-13T20:02:48.193884+00:00',
          is_expired: false,
          token: token,
        },
        tenant_name: 'Test Tenant 1',
        flow_name: null,
        invite_type: 'tenant_member',
        role: 'MEMBER',
        email: 'adammcc@gmail.com',
        expires_at: '2025-10-13T20:02:48.193884+00:00',
      });
    }

    // Flow enrollment invite
    if (token === 'flow-invite-token-123') {
      return HttpResponse.json({
        valid: true,
        invite: {
          uuid: 'flow-invite-uuid',
          email: 'user@example.com',
          invite_type: 'flow_enrollment',
          status: 'pending',
          tenant: 'tenant-uuid',
          tenant_name: 'Acme Corporation',
          flow: 'flow-uuid-here',
          flow_name: 'Project Approval Process',
          role: null,
          expires_at: '2025-10-13T20:37:47.466701+00:00',
          is_expired: false,
          token: token,
        },
        tenant_name: 'Acme Corporation',
        flow_name: 'Project Approval Process',
        invite_type: 'flow_enrollment',
        role: null,
        email: 'user@example.com',
        expires_at: '2025-10-13T20:37:47.466701+00:00',
      });
    }

    if (token === 'expired-token') {
      return HttpResponse.json(
        { error: 'This invite has expired' },
        { status: 400 }
      );
    }

    if (token === 'used-token') {
      return HttpResponse.json(
        { error: 'This invite is no longer pending (status: accepted)' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { error: 'Invalid invite token' },
      { status: 400 }
    );
  }),

  // Handle authentication errors
  http.get(`${API_BASE_URL}/protected-endpoint`, () => {
    return new HttpResponse(null, { status: 401 });
  }),

  // Flow Management Endpoints

  // Get flows for a tenant
  http.get(
    `${API_BASE_URL}/tenants/:tenantUuid/flows`,
    ({ params, request }) => {
      const { tenantUuid } = params;
      const url = new URL(request.url);

      // Parse query parameters
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(
        url.searchParams.get('page_size') ||
          String(PAGINATION.DEFAULT_PAGE_SIZE)
      );
      const search = url.searchParams.get('search') || '';

      // Filter flows by tenant UUID
      let tenantFlows = createdFlows.filter(
        flow => flow.tenant_uuid === tenantUuid
      );

      // Apply search filter
      if (search) {
        tenantFlows = tenantFlows.filter(flow =>
          flow?.name?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Calculate pagination
      const totalCount = tenantFlows.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedFlows = tenantFlows.slice(startIndex, endIndex);

      // Generate next/previous URLs
      const baseUrl = `${API_BASE_URL}/tenants/${tenantUuid}/flows`;
      const next =
        page < totalPages
          ? `${baseUrl}?page=${page + 1}&page_size=${pageSize}${search ? `&search=${search}` : ''}`
          : null;
      const previous =
        page > 1
          ? `${baseUrl}?page=${page - 1}&page_size=${pageSize}${search ? `&search=${search}` : ''}`
          : null;

      // Return paginated response format
      return HttpResponse.json({
        count: totalCount,
        next,
        previous,
        results: paginatedFlows,
      });
    }
  ),

  // Create a new flow
  http.post(
    `${API_BASE_URL}/tenants/:tenantUuid/flows`,
    async ({ request, params }) => {
      const { tenantUuid } = params;
      const { name } = (await request.json()) as { name: string };

      if (!name) {
        return HttpResponse.json(
          { detail: 'Flow name is required' },
          { status: 400 }
        );
      }

      const newFlow: Flow = {
        uuid: `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        tenant_name: 'Test Tenant 1', // In real app, would lookup tenant name by UUID
        tenant_uuid: tenantUuid as string,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };

      createdFlows.push(newFlow);

      return HttpResponse.json(
        {
          uuid: newFlow.uuid,
          name: newFlow.name,
          tenant_name: newFlow.tenant_name,
        },
        { status: 201 }
      );
    }
  ),

  // Get a specific flow
  http.get(
    `${API_BASE_URL}/tenants/:tenantUuid/flows/:flowUuid`,
    ({ params }) => {
      const { flowUuid } = params;
      const flow = createdFlows.find(f => f.uuid === flowUuid);

      if (!flow) {
        return HttpResponse.json({ detail: 'Flow not found' }, { status: 404 });
      }

      return HttpResponse.json(flow);
    }
  ),

  // Update a flow
  http.patch(
    `${API_BASE_URL}/tenants/:tenantUuid/flows/:flowUuid`,
    async ({ request, params }) => {
      const { flowUuid } = params;
      const updates = (await request.json()) as Partial<Flow>;

      const flowIndex = createdFlows.findIndex(f => f.uuid === flowUuid);

      if (flowIndex === -1) {
        return HttpResponse.json({ detail: 'Flow not found' }, { status: 404 });
      }

      createdFlows[flowIndex] = {
        ...createdFlows[flowIndex],
        ...updates,
        modified: new Date().toISOString(),
      };

      return HttpResponse.json(createdFlows[flowIndex]);
    }
  ),

  // Delete a flow
  http.delete(
    `${API_BASE_URL}/tenants/:tenantUuid/flows/:flowUuid`,
    ({ params }) => {
      const { flowUuid } = params;
      const flowIndex = createdFlows.findIndex(f => f.uuid === flowUuid);

      if (flowIndex === -1) {
        return HttpResponse.json({ detail: 'Flow not found' }, { status: 404 });
      }

      createdFlows.splice(flowIndex, 1);

      return new HttpResponse(null, { status: 204 });
    }
  ),

  // Member Management Endpoints

  // Get members for a tenant
  http.get(
    `${API_BASE_URL}/tenants/:tenantUuid/memberships`,
    ({ params, request }) => {
      const { tenantUuid } = params;
      const url = new URL(request.url);

      // Parse query parameters
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(
        url.searchParams.get('page_size') ||
          String(PAGINATION.DEFAULT_PAGE_SIZE)
      );
      const search = url.searchParams.get('search') || '';

      // Filter members by tenant UUID
      let tenantMembers = createdMembers.filter(
        member => member.tenant_uuid === tenantUuid
      );

      // Apply search filter
      if (search) {
        tenantMembers = tenantMembers.filter(
          member =>
            member?.user_name?.toLowerCase().includes(search.toLowerCase()) ||
            member?.user_email?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Calculate pagination
      const totalCount = tenantMembers.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMembers = tenantMembers.slice(startIndex, endIndex);

      // Generate next/previous URLs
      const baseUrl = `${API_BASE_URL}/tenants/${tenantUuid}/memberships`;
      const next =
        page < totalPages
          ? `${baseUrl}?page=${page + 1}&page_size=${pageSize}${search ? `&search=${search}` : ''}`
          : null;
      const previous =
        page > 1
          ? `${baseUrl}?page=${page - 1}&page_size=${pageSize}${search ? `&search=${search}` : ''}`
          : null;

      // Return paginated response format
      return HttpResponse.json({
        count: totalCount,
        next,
        previous,
        results: paginatedMembers,
      });
    }
  ),

  // Get a specific member
  http.get(
    `${API_BASE_URL}/tenants/:tenantUuid/memberships/:memberUuid`,
    ({ params }) => {
      const { memberUuid } = params;
      const member = createdMembers.find(m => m.uuid === memberUuid);

      if (!member) {
        return HttpResponse.json(
          { detail: 'Member not found' },
          { status: 404 }
        );
      }

      return HttpResponse.json(member);
    }
  ),

  // Update a member's role
  http.patch(
    `${API_BASE_URL}/tenants/:tenantUuid/memberships/:memberUuid`,
    async ({ request, params }) => {
      const { memberUuid } = params;
      const updates = (await request.json()) as Partial<Member>;

      const memberIndex = createdMembers.findIndex(m => m.uuid === memberUuid);

      if (memberIndex === -1) {
        return HttpResponse.json(
          { detail: 'Member not found' },
          { status: 404 }
        );
      }

      createdMembers[memberIndex] = {
        ...createdMembers[memberIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      return HttpResponse.json(createdMembers[memberIndex]);
    }
  ),

  // Delete a member
  http.delete(
    `${API_BASE_URL}/tenants/:tenantUuid/memberships/:memberUuid`,
    ({ params }) => {
      const { memberUuid } = params;
      const memberIndex = createdMembers.findIndex(m => m.uuid === memberUuid);

      if (memberIndex === -1) {
        return HttpResponse.json(
          { detail: 'Member not found' },
          { status: 404 }
        );
      }

      createdMembers.splice(memberIndex, 1);

      return new HttpResponse(null, { status: 204 });
    }
  ),

  // Enrollment Management Endpoints

  // Get enrollments for a tenant with filtering
  http.get(
    `${API_BASE_URL}/tenants/:tenantUuid/enrollments`,
    ({ params, request }) => {
      const { tenantUuid } = params;
      const url = new URL(request.url);

      // Parse query parameters
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(
        url.searchParams.get('page_size') ||
          String(PAGINATION.DEFAULT_PAGE_SIZE)
      );
      const searchUser = url.searchParams.get('search_user') || '';
      const flow = url.searchParams.get('flow') || '';
      const currentStep = url.searchParams.get('current_step') || '';

      // Filter enrollments by tenant UUID
      let tenantEnrollments = createdEnrollments.filter(
        enrollment => enrollment.tenant_uuid === tenantUuid
      );

      // Apply search filter (user name/email)
      if (searchUser) {
        tenantEnrollments = tenantEnrollments.filter(
          enrollment =>
            enrollment?.user_name
              ?.toLowerCase()
              .includes(searchUser.toLowerCase()) ||
            enrollment?.user_email
              ?.toLowerCase()
              .includes(searchUser.toLowerCase())
        );
      }

      // Apply flow filter
      if (flow) {
        tenantEnrollments = tenantEnrollments.filter(
          enrollment => enrollment.flow_uuid === flow
        );
      }

      // Apply current step filter
      if (currentStep) {
        tenantEnrollments = tenantEnrollments.filter(
          enrollment => enrollment.current_step_uuid === currentStep
        );
      }

      // Calculate pagination
      const totalCount = tenantEnrollments.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedEnrollments = tenantEnrollments.slice(
        startIndex,
        endIndex
      );

      // Generate next/previous URLs
      const baseUrl = `${API_BASE_URL}/tenants/${tenantUuid}/enrollments`;
      const params_obj: any = { page_size: pageSize };
      if (searchUser) params_obj.search_user = searchUser;
      if (flow) params_obj.flow = flow;
      if (currentStep) params_obj.current_step = currentStep;

      const next =
        page < totalPages
          ? `${baseUrl}?${new URLSearchParams({ ...params_obj, page: (page + 1).toString() }).toString()}`
          : null;
      const previous =
        page > 1
          ? `${baseUrl}?${new URLSearchParams({ ...params_obj, page: (page - 1).toString() }).toString()}`
          : null;

      return HttpResponse.json({
        count: totalCount,
        next,
        previous,
        results: paginatedEnrollments,
      });
    }
  ),

  // Get a specific enrollment
  http.get(
    `${API_BASE_URL}/tenants/:tenantUuid/enrollments/:enrollmentUuid`,
    ({ params }) => {
      const { enrollmentUuid } = params;
      const enrollment = createdEnrollments.find(
        e => e.uuid === enrollmentUuid
      );

      if (!enrollment) {
        return HttpResponse.json(
          { detail: 'Enrollment not found' },
          { status: 404 }
        );
      }

      return HttpResponse.json(enrollment);
    }
  ),

  // Delete an enrollment
  http.delete(
    `${API_BASE_URL}/tenants/:tenantUuid/enrollments/:enrollmentUuid`,
    ({ params }) => {
      const { enrollmentUuid } = params;
      const enrollmentIndex = createdEnrollments.findIndex(
        e => e.uuid === enrollmentUuid
      );

      if (enrollmentIndex === -1) {
        return HttpResponse.json(
          { detail: 'Enrollment not found' },
          { status: 404 }
        );
      }

      createdEnrollments.splice(enrollmentIndex, 1);
      return new HttpResponse(null, { status: 204 });
    }
  ),

  // Get flow steps for a specific flow
  http.get(
    `${API_BASE_URL}/tenants/:tenantUuid/flows/:flowUuid/steps`,
    ({ params }) => {
      const { flowUuid } = params;

      // Find the flow and return its steps
      const flowWithSteps = mockFlowsWithSteps.find(f => f.uuid === flowUuid);
      if (!flowWithSteps) {
        return HttpResponse.json({ detail: 'Flow not found' }, { status: 404 });
      }

      // Return paginated response structure
      return HttpResponse.json({
        count: flowWithSteps.steps.length,
        next: null,
        previous: null,
        results: flowWithSteps.steps,
      });
    }
  ),

  // Mark all messages as read
  http.post(`${API_BASE_URL}/messages/mark_all_read`, () => {
    // In a real implementation, this would mark all unread messages as read
    // For the mock, we'll simulate marking 5 messages as read
    const updatedCount = 5;

    return HttpResponse.json({
      message: `Marked ${updatedCount} messages as read`,
      updated_count: updatedCount,
    });
  }),

  // Create enrollment (for QR code invitations)
  http.post(
    `${API_BASE_URL}/tenants/:tenantUuid/enrollments`,
    async ({ params, request }) => {
      const { tenantUuid } = params;
      const { flow, user } = (await request.json()) as {
        flow: string;
        user: number;
      };

      // Validate required fields
      if (!flow) {
        return HttpResponse.json(
          { flow: ['This field is required.'] },
          { status: 400 }
        );
      }
      if (!user) {
        return HttpResponse.json(
          { user: ['This field is required.'] },
          { status: 400 }
        );
      }

      // Find the flow to get its details
      const flowData = mockFlowsWithSteps.find(f => f.uuid === flow);
      if (!flowData) {
        return HttpResponse.json({ detail: 'Flow not found' }, { status: 404 });
      }

      // Create a new enrollment
      const newEnrollment: Enrollment = {
        uuid: `enrollment-${Date.now()}`,
        user_id: user,
        user_name: 'Current User',
        user_email: 'user@example.com',
        flow_name: flowData.name,
        flow_uuid: flowData.uuid,
        tenant_name: 'Test Tenant 1',
        tenant_uuid: tenantUuid as string,
        current_step_name: flowData.steps[0]?.name || 'Initial Step',
        current_step_uuid: flowData.steps[0]?.uuid || 'step-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to our mock enrollments
      createdEnrollments.push(newEnrollment);

      return HttpResponse.json(newEnrollment, { status: 201 });
    }
  ),

  // Create public enrollment (for external users via QR code)
  http.post(`${API_BASE_URL}/public/enrollments`, async ({ request }) => {
    const { tenant_name, flow_name, user_email } = (await request.json()) as {
      tenant_name: string;
      flow_name: string;
      user_email: string;
    };

    // Validate required fields
    if (!tenant_name) {
      return HttpResponse.json(
        { tenant_name: ['This field is required.'] },
        { status: 400 }
      );
    }
    if (!flow_name) {
      return HttpResponse.json(
        { flow_name: ['This field is required.'] },
        { status: 400 }
      );
    }
    if (!user_email) {
      return HttpResponse.json(
        { user_email: ['This field is required.'] },
        { status: 400 }
      );
    }

    // Find the flow to get its details (simplified for public endpoint)
    const flowData = mockFlowsWithSteps.find(
      f => f?.name?.toLowerCase() === flow_name.toLowerCase()
    );
    if (!flowData) {
      return HttpResponse.json({ detail: 'Flow not found' }, { status: 404 });
    }

    // Simulate pending invite error for specific email
    if (user_email === 'mccarthy.adamcbc@gmail.com') {
      return HttpResponse.json(
        {
          error:
            'A pending invite already exists for mccarthy.adamcbc@gmail.com to join Flow 1',
        },
        { status: 400 }
      );
    }

    // Simulate sending email invitation
    logger.info(
      `📧 Email invitation sent to ${user_email} for ${flow_name} at ${tenant_name}`
    );

    // Return success message
    return HttpResponse.json(
      {
        message: 'Invitation sent successfully',
        email: user_email,
        tenant_name: tenant_name,
        flow_name: flow_name,
      },
      { status: 201 }
    );
  }),

  // Tenant handlers
  // Get tenant by name (public endpoint)
  http.get(`${API_BASE_URL}/public/tenants/:tenantName`, ({ params }) => {
    const { tenantName } = params;

    // Decode the tenant name from URL encoding
    const decodedTenantName = decodeURIComponent(tenantName as string);

    // Find tenant by name
    const tenant = mockTenants.find(
      t => t?.name?.toLowerCase() === decodedTenantName.toLowerCase()
    );

    if (!tenant) {
      return HttpResponse.json({ detail: 'Tenant not found' }, { status: 404 });
    }

    // Return tenant with theme and logo (public response structure)
    const response = {
      uuid: tenant.uuid,
      name: tenant.name,
      description:
        'We are a leading organization dedicated to excellence and innovation. Our mission is to provide outstanding services and create meaningful impact in our community.',
      theme: {
        primary_color: '#3b82f6', // Default blue
        secondary_color: '#1e40af', // Default darker blue
        text_color: '#ffffff', // Default white text
      },
      logo: '/stored_media/local/tenant_logos/logo.png', // Sample logo for testing
      contact_phone: '+1 (555) 123-4567', // Sample phone
      contact_email: 'contact@example.com', // Sample email
      tier: 'PREMIUM',
    };
    logger.info('🌐 Mock API - Public tenant response:', response);
    return HttpResponse.json(response);
  }),

  // Get tenant by UUID (authenticated)
  http.get(`${API_BASE_URL}/tenants/:tenantUuid`, ({ params }) => {
    const { tenantUuid } = params;

    const tenant = mockTenants.find(t => t.uuid === tenantUuid);
    if (!tenant) {
      return HttpResponse.json({ detail: 'Tenant not found' }, { status: 404 });
    }

    const response = {
      uuid: tenant.uuid,
      name: tenant.name,
      description:
        'We are a leading organization dedicated to excellence and innovation. Our mission is to provide outstanding services and create meaningful impact in our community.',
      theme: {
        primary_color: '#3b82f6',
        secondary_color: '#1e40af',
        text_color: '#ffffff',
      },
      logo: '/stored_media/local/tenant_logos/logo.png', // Sample logo for testing
      contact_phone: '+1 (555) 123-4567', // Sample phone
      contact_email: 'contact@example.com', // Sample email
      tier: 'PREMIUM',
      memberships: mockMembers.filter(m => m.tenant_uuid === tenant.uuid),
      created_at: tenant.created_at,
      updated_at: tenant.updated_at,
    };
    logger.info('🔐 Mock API - Authenticated tenant response:', response);
    return HttpResponse.json(response);
  }),

  // Update tenant (theme, logo, etc.)
  http.patch(
    `${API_BASE_URL}/tenants/:tenantUuid`,
    async ({ params, request }) => {
      const { tenantUuid } = params;

      const tenant = mockTenants.find(t => t.uuid === tenantUuid);
      if (!tenant) {
        return HttpResponse.json(
          { detail: 'Tenant not found' },
          { status: 404 }
        );
      }

      // Check if this is a file upload (FormData) or JSON update
      const contentType = request.headers.get('content-type');
      let updateData: any = {};

      if (contentType?.includes('multipart/form-data')) {
        // Handle file upload
        const formData = await request.formData();
        const logoFile = formData.get('logo') as File;

        if (logoFile) {
          // Simulate file upload - return a mock URL
          updateData.logo = `/stored_media/local/tenant_logos/${tenant?.name?.toLowerCase().replace(/\s+/g, '_')}_logo.png`;
          logger.info(
            `🏢 Uploaded logo for tenant ${tenant.name}:`,
            logoFile.name,
            `(${logoFile.size} bytes)`
          );
          logger.info(`🖼️ Logo URL set to:`, updateData.logo);
        }
      } else {
        // Handle JSON update
        try {
          updateData = await request.json();
          logger.info(`🏢 Updated tenant ${tenant.name}:`, updateData);
        } catch (error) {
          logger.error('Failed to parse JSON:', error);
          return HttpResponse.json({ detail: 'Invalid JSON' }, { status: 400 });
        }
      }

      return HttpResponse.json({
        uuid: tenant.uuid,
        name: updateData.name || tenant.name,
        theme: updateData.theme || {
          primary_color: '#3b82f6',
          secondary_color: '#1e40af',
          text_color: '#ffffff',
        },
        logo: updateData.logo || null,
        memberships: mockMembers.filter(m => m.tenant_uuid === tenant.uuid),
        created_at: tenant.created_at,
        updated_at: new Date().toISOString(),
      });
    }
  ),

  // Logo file handler - serve sample logo images
  http.get(
    `${API_BASE_URL}/stored_media/local/tenant_logos/:filename`,
    ({ params }) => {
      const { filename } = params;
      logger.info(`🖼️ Serving logo file:`, filename);

      // Return a simple SVG logo
      const svgLogo = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#3b82f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">LOGO</text>
      </svg>
    `;

      // Convert SVG to PNG data URL
      const base64Svg = btoa(svgLogo);
      const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

      return new Response(dataUrl, {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      });
    }
  ),

  // Message handlers
  // Get messages with filtering
  http.get(`${API_BASE_URL}/messages`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(
      url.searchParams.get('page_size') || String(PAGINATION.DEFAULT_PAGE_SIZE)
    );
    const messageType = url.searchParams.get('message_type');
    const isRead = url.searchParams.get('is_read');
    const requiresAction = url.searchParams.get('requires_action');

    // Mock messages data
    const mockMessages = [
      {
        uuid: 'msg-1-uuid',
        title: 'New Flow Invitation',
        content: 'You have been invited to join the "Onboarding Process" flow.',
        message_type: 'flow_invite',
        is_read: false,
        requires_action: true,
        action_accepted: null,
        sent_by_name: 'John Doe',
        tenant_name: 'Acme Corp',
        flow_name: 'Onboarding Process',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
      {
        uuid: 'msg-2-uuid',
        title: 'Status Update',
        content: 'Your enrollment in "Customer Onboarding" has been updated.',
        message_type: 'status_update',
        is_read: true,
        requires_action: false,
        action_accepted: null,
        sent_by_name: 'System',
        tenant_name: 'Acme Corp',
        flow_name: 'Customer Onboarding',
        created_at: '2024-01-14T15:30:00Z',
        updated_at: '2024-01-14T15:30:00Z',
      },
      {
        uuid: 'msg-3-uuid',
        title: 'Tenant Invitation',
        content:
          'You have been invited to join "Tech Startup Inc" as a member.',
        message_type: 'tenant_invite',
        is_read: false,
        requires_action: true,
        action_accepted: null,
        sent_by_name: 'Jane Smith',
        tenant_name: 'Tech Startup Inc',
        flow_name: null,
        created_at: '2024-01-13T09:15:00Z',
        updated_at: '2024-01-13T09:15:00Z',
      },
      {
        uuid: 'msg-4-uuid',
        title: 'Action Already Taken',
        content: 'You have been invited to join the "Marketing Campaign" flow.',
        message_type: 'flow_invite',
        is_read: false,
        requires_action: true,
        action_accepted: 'accept', // This message has already been acted upon
        sent_by_name: 'Marketing Team',
        tenant_name: 'Acme Corp',
        flow_name: 'Marketing Campaign',
        created_at: '2024-01-12T14:20:00Z',
        updated_at: '2024-01-12T14:20:00Z',
      },
    ];

    // Apply filters
    let filteredMessages = mockMessages;

    if (messageType) {
      filteredMessages = filteredMessages.filter(
        msg => msg.message_type === messageType
      );
    }

    if (isRead !== null) {
      const readFilter = isRead === 'true';
      filteredMessages = filteredMessages.filter(
        msg => msg.is_read === readFilter
      );
    }

    if (requiresAction !== null) {
      const actionFilter = requiresAction === 'true';
      filteredMessages = filteredMessages.filter(
        msg => msg.requires_action === actionFilter
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

    return HttpResponse.json({
      count: filteredMessages.length,
      next:
        endIndex < filteredMessages.length
          ? `${API_BASE_URL}/messages?page=${page + 1}&page_size=${pageSize}`
          : null,
      previous:
        page > 1
          ? `${API_BASE_URL}/messages?page=${page - 1}&page_size=${pageSize}`
          : null,
      results: paginatedMessages,
    });
  }),

  // Mark message as read
  http.post(`${API_BASE_URL}/messages/:messageUuid/mark_read`, ({ params }) => {
    const { messageUuid } = params;

    // Simulate marking message as read
    return HttpResponse.json({
      uuid: messageUuid,
      title: 'Message Title',
      content: 'Message content',
      message_type: 'flow_invite',
      is_read: true,
      requires_action: true,
      action_accepted: null,
      sent_by_name: 'John Doe',
      tenant_name: 'Acme Corp',
      flow_name: 'Onboarding Process',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    });
  }),

  // Take action on message (accept/reject)
  http.post(
    `${API_BASE_URL}/messages/:messageUuid/take_action`,
    async ({ params, request }) => {
      const { messageUuid } = params;
      const { action } = (await request.json()) as { action: string };

      // Simulate duplicate action error for msg-4-uuid
      if (messageUuid === 'msg-4-uuid') {
        return HttpResponse.json(
          { error: 'Action has already been taken on this message' },
          { status: 400 }
        );
      }

      // Simulate successful action
      return HttpResponse.json({
        uuid: messageUuid,
        title: 'Message Title',
        content: 'Message content',
        message_type: 'flow_invite',
        is_read: true,
        requires_action: true,
        action_accepted: action,
        sent_by_name: 'John Doe',
        tenant_name: 'Acme Corp',
        flow_name: 'Onboarding Process',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      });
    }
  ),
];
