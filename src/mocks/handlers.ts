import { http, HttpResponse } from 'msw';
import { User } from '../types/user';

const API_BASE_URL = 'http://localhost:8000'; // Use fixed URL for tests

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  color_scheme: 'light',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const handlers = [
  // Get current user
  http.get(`${API_BASE_URL}/user/me`, () => {
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
    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({ access: 'mock_access_token', refresh: 'mock_refresh_token' });
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
