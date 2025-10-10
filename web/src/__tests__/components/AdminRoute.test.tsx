import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminRoute } from '@/components/AdminRoute';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    getToken: vi.fn(),
    getUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
  };
});

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to login when not authenticated', () => {
    vi.mocked(api.getToken).mockReturnValue(null);

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminRoute>
            <div>Admin Content</div>
          </AdminRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Navigate to /login')).toBeDefined();
  });

  it('should redirect to modules when authenticated but not admin', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      study: 'Computer Science',
      role: 1, // Not admin
      createdAt: new Date(),
    };

    vi.mocked(api.getToken).mockReturnValue('jwt-token');
    localStorage.setItem('user_id', 'user123');
    vi.mocked(api.getUser).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminRoute>
            <div>Admin Content</div>
          </AdminRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for auth to load, then should redirect to modules
    await vi.waitFor(() => {
      expect(screen.getByText('Navigate to /modules')).toBeDefined();
    });
  });

  it('should render children when authenticated as admin', async () => {
    const mockUser = {
      id: 'admin123',
      email: 'admin@example.com',
      name: 'Admin User',
      study: 'Computer Science',
      role: 2, // Admin
      createdAt: new Date(),
    };

    vi.mocked(api.getToken).mockReturnValue('jwt-token');
    localStorage.setItem('user_id', 'admin123');
    vi.mocked(api.getUser).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminRoute>
            <div>Admin Content</div>
          </AdminRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    await vi.waitFor(() => {
      expect(screen.getByText('Admin Content')).toBeDefined();
    });
  });
});
