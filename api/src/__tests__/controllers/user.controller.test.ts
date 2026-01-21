import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserController } from '@adapters/controllers/user.controller.js';
import type { UserService } from '@application/services/user.service.js';
import type { IJwtService } from '@domain/services/IJwtService.js';
import { ok, err } from '@shared/result.js';
import { NotFoundError, ValidationError } from '@shared/error.js';
import type { User } from '@domain/entities/User.js';
import type { Module } from '@domain/entities/Module.js';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: UserService;
  let mockJwtService: IJwtService;
  let mockContext: any;

  beforeEach(() => {
    mockUserService = {
      register: { execute: vi.fn() },
      login: { execute: vi.fn() },
      getById: { execute: vi.fn() },
      update: { execute: vi.fn() },
      deleteUser: { execute: vi.fn() },
      listFavorites: { execute: vi.fn() },
      addFavorite: { execute: vi.fn() },
      removeFavorite: { execute: vi.fn() },
    } as any;

    mockJwtService = {
      sign: vi.fn(),
      verify: vi.fn(),
    };

    mockContext = {
      req: {
        json: vi.fn(),
        param: vi.fn(),
      },
      json: vi.fn((data, status) => ({ data, status })),
    };

    userController = new UserController(mockUserService, mockJwtService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        password: 'password123',
      };

      mockContext.req.json.mockResolvedValue(userData);
      vi.mocked(mockUserService.register.execute).mockResolvedValue(
        ok({ id: 'user123' })
      );

      const response = await userController.register(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ id: 'user123' }),
        }),
        201
      );
    });

    it('should handle registration failure', async () => {
      mockContext.req.json.mockResolvedValue({
        email: 'existing@example.com',
        name: 'Test',
        study: 'CS',
        password: 'pass',
      });

      vi.mocked(mockUserService.register.execute).mockResolvedValue(
        err(new ValidationError('Email already registered'))
      );

      const response = await userController.register(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ message: 'Email already registered' }),
        }),
        400
      );
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      mockContext.req.json.mockResolvedValue({
        email: 'test@example.com',
        password: 'password123',
      });

      vi.mocked(mockUserService.login.execute).mockResolvedValue(
        ok({ id: 'user123' })
      );

      vi.mocked(mockJwtService.sign).mockResolvedValue('jwt-token');

      const response = await userController.login(mockContext);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { userId: 'user123' },
        { expiresIn: '24h' }
      );

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 'user123',
            token: 'jwt-token',
          }),
        }),
        200
      );
    });

    it('should handle login failure', async () => {
      mockContext.req.json.mockResolvedValue({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      vi.mocked(mockUserService.login.execute).mockResolvedValue(
        err(new ValidationError('Invalid Credentials'))
      );

      const response = await userController.login(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ message: 'Invalid Credentials' }),
        }),
        401
      );
    });
  });

  describe('getById', () => {
    it('should get user by id', async () => {
      const user: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        passwordHash: 'hash',
        role: 1,
        favorites: [],
        createdAt: new Date(),
      };

      mockContext.req.param.mockReturnValue('user123');
      vi.mocked(mockUserService.getById.execute).mockResolvedValue(ok(user));

      const response = await userController.getById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 'user123',
            email: 'test@example.com',
          }),
        }),
        200
      );
    });

    it('should handle user not found', async () => {
      mockContext.req.param.mockReturnValue('nonexistent');
      vi.mocked(mockUserService.getById.execute).mockResolvedValue(
        err(new NotFoundError('User not found'))
      );

      const response = await userController.getById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        }),
        404
      );
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      mockContext.req.param.mockReturnValue('user123');
      mockContext.req.json.mockResolvedValue({ name: 'Updated Name' });

      vi.mocked(mockUserService.update.execute).mockResolvedValue(
        ok({ id: 'user123' })
      );

      const response = await userController.update(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ id: 'user123' }),
        }),
        200
      );
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockContext.req.param.mockReturnValue('user123');
      vi.mocked(mockUserService.deleteUser.execute).mockResolvedValue(undefined);

      const response = await userController.delete(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        }),
        200
      );
    });
  });

  describe('getFavorites', () => {
    it('should get user favorites', async () => {
      const modules: Module[] = [
        {
          id: 'module1',
          name: 'Module 1',
          shortdescription: 'Short desc',
          description: 'Desc',
          content: 'Content',
          studycredit: 5,
          location: 'Campus A',
          contact_id: 1,
          level: 'Bachelor',
          learningoutcomes: 'Outcomes',
        },
      ];

      mockContext.req.param.mockReturnValue('user123');
      vi.mocked(mockUserService.listFavorites.execute).mockResolvedValue(ok(modules));

      const response = await userController.getFavorites(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.arrayContaining([
            expect.objectContaining({ name: 'Module 1' }),
          ]),
        }),
        200
      );
    });
  });

  describe('addFavorite', () => {
    it('should add favorite', async () => {
      mockContext.req.param.mockReturnValueOnce('user123').mockReturnValueOnce('module123');

      vi.mocked(mockUserService.addFavorite.execute).mockResolvedValue(
        ok({ message: 'Module added to favorites' })
      );

      const response = await userController.addFavorite(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        }),
        200
      );
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite', async () => {
      mockContext.req.param.mockReturnValueOnce('user123').mockReturnValueOnce('module123');

      vi.mocked(mockUserService.removeFavorite.execute).mockResolvedValue(
        ok({ message: 'Module removed from favorites' })
      );

      const response = await userController.removeFavorite(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        }),
        200
      );
    });
  });
});
