import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
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

describe('ProtectedRoute', () => {
  it('should show loading state while checking authentication', () => {
    vi.mocked(api.getToken).mockReturnValue('jwt-token');
    localStorage.setItem('user_id', 'user123');
    vi.mocked(api.getUser).mockReturnValue(new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('should redirect to login when not authenticated', async () => {
    vi.mocked(api.getToken).mockReturnValue(null);

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    await screen.findByText('Navigate to /login');
  });

  it('should render children when authenticated', async () => {
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
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    await screen.findByText('Protected Content');
  });
});
