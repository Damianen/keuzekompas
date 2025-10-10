import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ProfilePage } from '@/pages/ProfilePage';
import { AuthProvider } from '@/contexts/AuthContext';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    getToken: vi.fn(),
    getUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
    getUserFavorites: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

describe('ProfilePage', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    study: 'Computer Science',
    role: 1,
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getToken).mockReturnValue('jwt-token');
    localStorage.setItem('user_id', 'user123');
    vi.mocked(api.getUser).mockResolvedValue({
      success: true,
      data: mockUser,
    });
    vi.mocked(api.getUserFavorites).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  it('should render profile information', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeDefined();
      expect(screen.getByText('test@example.com')).toBeDefined();
      expect(screen.getByText('Computer Science')).toBeDefined();
    });
  });

  it('should show edit form when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeDefined();
    });

    const editButton = screen.getByRole('button', { name: /edit profile/i });
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeDefined();
      expect(screen.getByDisplayValue('test@example.com')).toBeDefined();
      expect(screen.getByDisplayValue('Computer Science')).toBeDefined();
    });
  });

  it('should handle profile update', async () => {
    const user = userEvent.setup();

    vi.mocked(api.updateUser).mockResolvedValue({
      success: true,
      data: { ...mockUser, name: 'Updated Name' },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeDefined();
    });

    const editButton = screen.getByRole('button', { name: /edit profile/i });
    await user.click(editButton);

    const nameInput = screen.getByDisplayValue('Test User');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(api.updateUser).toHaveBeenCalledWith('user123', {
        name: 'Updated Name',
        email: 'test@example.com',
        study: 'Computer Science',
      });
    });
  });

  it('should display favorites', async () => {
    const mockFavorites = [
      {
        id: 'module1',
        name: 'Test Module',
        provider: 'Test Provider',
        level: 'Bachelor',
        duration: 8,
        language: 'English',
        location: 'Online',
        period: 'Fall',
        credits: 5,
      },
    ];

    vi.mocked(api.getUserFavorites).mockResolvedValue({
      success: true,
      data: mockFavorites,
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Module')).toBeDefined();
      expect(screen.getByText(/Test Provider/)).toBeDefined();
    });
  });

  it('should handle remove favorite', async () => {
    const user = userEvent.setup();
    const mockFavorites = [
      {
        id: 'module1',
        name: 'Test Module',
        provider: 'Test Provider',
        level: 'Bachelor',
        duration: 8,
        language: 'English',
        location: 'Online',
        period: 'Fall',
        credits: 5,
      },
    ];

    vi.mocked(api.getUserFavorites).mockResolvedValue({
      success: true,
      data: mockFavorites,
    });

    vi.mocked(api.removeFavorite).mockResolvedValue({
      success: true,
    } as never);

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Module')).toBeDefined();
    });

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    await waitFor(() => {
      expect(api.removeFavorite).toHaveBeenCalledWith('user123', 'module1');
    });
  });
});
