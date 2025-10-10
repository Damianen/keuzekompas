import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '@/services/api';

describe('ApiService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const mockResponse = {
        success: true,
        data: { id: 'user123' },
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await api.register({
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data.id).toBe('user123');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/register'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );
    });

    it('should login and store token', async () => {
      const mockResponse = {
        success: true,
        data: { id: 'user123', token: 'jwt-token' },
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await api.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data.token).toBe('jwt-token');
      expect(api.getToken()).toBe('jwt-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'jwt-token');
    });

    it('should logout and remove token', () => {
      localStorage.setItem('auth_token', 'jwt-token');
      api.setToken('jwt-token');

      api.logout();

      expect(api.getToken()).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('User Operations', () => {
    beforeEach(() => {
      api.setToken('jwt-token');
    });

    it('should get user by id', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        role: 1,
        createdAt: new Date(),
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockUser }),
      } as Response);

      const result = await api.getUser('user123');

      expect(result.success).toBe(true);
      expect(result.data.id).toBe('user123');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/user123'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer jwt-token',
          }),
        })
      );
    });

    it('should update user', async () => {
      const mockResponse = {
        success: true,
        data: { id: 'user123' },
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await api.updateUser('user123', {
        name: 'Updated Name',
      });

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/user123'),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });

    it('should get user favorites', async () => {
      const mockFavorites = [
        { id: 'module1', name: 'Module 1', provider: 'University X', level: 'Bachelor', duration: 8 },
        { id: 'module2', name: 'Module 2', provider: 'University Y', level: 'Master', duration: 10 },
      ];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockFavorites }),
      } as Response);

      const result = await api.getUserFavorites('user123');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should add favorite', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: null }),
      } as Response);

      const result = await api.addFavorite('user123', 'module123');

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/user123/favorites/module123'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should remove favorite', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: null }),
      } as Response);

      const result = await api.removeFavorite('user123', 'module123');

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/user123/favorites/module123'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('Module Operations', () => {
    it('should list modules', async () => {
      const mockModules = {
        modules: [
          {
            id: 'module1',
            name: 'Module 1',
            location: 'Campus A',
            period: 1,
            provider: 'University X',
            duration: 8,
            language: 'English',
            level: 'Bachelor',
            description: 'Description',
            information: 'Info',
            createdAt: new Date(),
          },
        ],
        total: 1,
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockModules }),
      } as Response);

      const result = await api.listModules();

      expect(result.success).toBe(true);
      expect(result.data.total).toBe(1);
      expect(result.data.modules).toHaveLength(1);
    });

    it('should get module by id', async () => {
      const mockModule = {
        id: 'module123',
        name: 'Advanced Programming',
        location: 'Campus A',
        period: 1,
        provider: 'University X',
        duration: 8,
        language: 'English',
        level: 'Bachelor',
        description: 'Description',
        information: 'Info',
        createdAt: new Date(),
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockModule }),
      } as Response);

      const result = await api.getModule('module123');

      expect(result.success).toBe(true);
      expect(result.data.id).toBe('module123');
    });

    it('should handle API errors', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
        json: async () => ({
          success: false,
          error: { message: 'Module not found' },
        }),
      } as Response);

      await expect(api.getModule('nonexistent')).rejects.toThrow('Module not found');
    });
  });
});
