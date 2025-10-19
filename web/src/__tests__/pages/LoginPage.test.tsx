import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
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
    useNavigate: () => vi.fn(),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getToken).mockReturnValue(null);
  });

  it('should render login form', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e-mailadres/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/wachtwoord/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /inloggen/i })).toBeDefined();
    });
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      study: 'Computer Science',
      role: 1,
      createdAt: new Date(),
    };

    vi.mocked(api.login).mockResolvedValue({
      success: true,
      data: { id: 'user123', token: 'jwt-token' },
    });

    vi.mocked(api.getUser).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => screen.getByPlaceholderText(/e-mailadres/i));

    const emailInput = screen.getByPlaceholderText(/e-mailadres/i);
    const passwordInput = screen.getByPlaceholderText(/wachtwoord/i);
    const submitButton = screen.getByRole('button', { name: /inloggen/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should display error message on login failure', async () => {
    const user = userEvent.setup();

    vi.mocked(api.login).mockRejectedValue(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => screen.getByPlaceholderText(/e-mailadres/i));

    const emailInput = screen.getByPlaceholderText(/e-mailadres/i);
    const passwordInput = screen.getByPlaceholderText(/wachtwoord/i);
    const submitButton = screen.getByRole('button', { name: /inloggen/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeDefined();
    });
  });

  it('should have link to register page', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const registerLink = screen.getByText(/registreren/i);
      expect(registerLink.closest('a')).toHaveProperty('href');
    });
  });
});
