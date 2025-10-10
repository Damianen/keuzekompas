import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from '@/pages/RegisterPage';
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

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getToken).mockReturnValue(null);
  });

  it('should render registration form', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/name@example.com/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/john doe/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/computer science/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeDefined();
    });
  });

  it('should handle successful registration', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      study: 'Computer Science',
      role: 1,
      createdAt: new Date(),
    };

    vi.mocked(api.register).mockResolvedValue({
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
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => screen.getByPlaceholderText(/john doe/i));

    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const nameInput = screen.getByPlaceholderText(/john doe/i);
    const studyInput = screen.getByPlaceholderText(/computer science/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(nameInput, 'Test User');
    await user.type(studyInput, 'Computer Science');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        study: 'Computer Science',
        password: 'password123',
      });
    });
  });

  it('should display error message on registration failure', async () => {
    const user = userEvent.setup();

    vi.mocked(api.register).mockRejectedValue(new Error('Email already exists'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => screen.getByPlaceholderText(/john doe/i));

    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const nameInput = screen.getByPlaceholderText(/john doe/i);
    const studyInput = screen.getByPlaceholderText(/computer science/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(nameInput, 'Test User');
    await user.type(studyInput, 'Computer Science');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeDefined();
    });
  });

  it('should have link to login page', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const loginLink = screen.getByText(/sign in/i);
      expect(loginLink.closest('a')).toHaveProperty('href');
    });
  });
});
