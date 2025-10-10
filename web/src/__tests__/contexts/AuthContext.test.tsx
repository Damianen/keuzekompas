import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

// Mock the API
vi.mock('@/services/api', () => ({
  api: {
    getToken: vi.fn(),
    getUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

function TestComponent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <div>Authenticated: {user?.name}</div>;
  return <div>Not authenticated</div>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide authentication context', async () => {
    vi.mocked(api.getToken).mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeDefined();
    });
  });

  it('should load user when token exists', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      study: 'Computer Science',
      role: 1,
      createdAt: new Date(),
    };

    vi.mocked(api.getToken).mockReturnValue('jwt-token');
    localStorage.setItem('user_id', 'user123');
    vi.mocked(api.getUser).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Authenticated: Test User')).toBeDefined();
    });
  });

  it('should handle login', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      study: 'Computer Science',
      role: 1,
      createdAt: new Date(),
    };

    vi.mocked(api.getToken).mockReturnValue(null);
    vi.mocked(api.login).mockResolvedValue({
      success: true,
      data: { id: 'user123', token: 'jwt-token' },
    });
    vi.mocked(api.getUser).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    let loginFn: ((credentials: { email: string; password: string }) => Promise<void>) | undefined;

    function LoginComponent() {
      const { login } = useAuth();
      loginFn = login;
      return <TestComponent />;
    }

    render(
      <AuthProvider>
        <LoginComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeDefined();
    });

    if (loginFn) {
      await loginFn({ email: 'test@example.com', password: 'password123' });
    }

    await waitFor(() => {
      expect(screen.getByText('Authenticated: Test User')).toBeDefined();
    });
  });

  it('should handle logout', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      study: 'Computer Science',
      role: 1,
      createdAt: new Date(),
    };

    vi.mocked(api.getToken).mockReturnValue('jwt-token');
    localStorage.setItem('user_id', 'user123');
    vi.mocked(api.getUser).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    let logoutFn: (() => void) | undefined;

    function LogoutComponent() {
      const { logout } = useAuth();
      logoutFn = logout;
      return <TestComponent />;
    }

    render(
      <AuthProvider>
        <LogoutComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Authenticated: Test User')).toBeDefined();
    });

    if (logoutFn) {
      logoutFn();
    }

    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeDefined();
    });
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
