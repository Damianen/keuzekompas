import type { Context } from "hono";
import type { UserService } from "@application/services/user.service.js";
import type { IJwtService } from "@domain/services/IJwtService.js";
import type {
    RegisterUserDto,
    LoginUserDto,
    UpdateUserDto,
    UserResponseDto,
    AuthResponseDto,
    ModuleSummaryDto
} from "@application/dtos/user.dto.js";
import type {
    ApiSuccessResponse,
    ApiErrorResponse,
    CreateResponse
} from "@application/dtos/common.dto.js";
import { ResSuccess, ResError } from "@utils/response.js";

export class UserController {
    constructor(
        private userService: UserService,
        private jwtService: IJwtService
    ) {}

    async register(c: Context) {
        try {
            const body: RegisterUserDto = await c.req.json();

            const result = await this.userService.register.execute(body);

            if (!result.ok) {
                return ResError(c, 'REGISTRATION_FAILED', result.error.message, 400);
            }

            const responseData: CreateResponse = {
                id: result.value.id,
                message: 'User registered successfully'
            };

            return ResSuccess(c, responseData, 201);
        } catch (error) {
            console.error('Registration error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Registration failed', 500);
        }
    }

    async login(c: Context) {
        try {
            const body: LoginUserDto = await c.req.json();

            const result = await this.userService.login.execute(body);

            if (!result.ok) {
                return ResError(c, 'LOGIN_FAILED', result.error.message, 401);
            }

            // Generate JWT token
            const token = await this.jwtService.sign(
                { userId: result.value.id },
                { expiresIn: '24h' }
            );

            const authResponse: AuthResponseDto = {
                id: result.value.id,
                token
            };

            return ResSuccess(c, authResponse);
        } catch (error) {
            console.error('Login error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Login failed', 500);
        }
    }

    async getById(c: Context) {
        try {
            const id = c.req.param('id');

            const result = await this.userService.getById.execute(id);

            if (!result.ok) {
                return ResError(c, 'USER_NOT_FOUND', result.error.message, 404);
            }

            const user = result.value;
            const userResponse: UserResponseDto = {
                id: user.id!,
                email: user.email,
                name: user.name,
                study: user.study,
                role: user.role,
                createdAt: user.createdAt
            };

            return ResSuccess(c, userResponse);
        } catch (error) {
            console.error('Get user error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to retrieve user', 500);
        }
    }

    async update(c: Context) {
        try {
            const id = c.req.param('id');
            const body: Partial<UpdateUserDto> = await c.req.json();

            const updateData = { ...body, id };

            const result = await this.userService.update.execute(updateData as any);

            if (!result.ok) {
                return ResError(c, 'UPDATE_FAILED', result.error.message, 400);
            }

            const responseData: CreateResponse = {
                id: result.value.id,
                message: 'User updated successfully'
            };

            return ResSuccess(c, responseData);
        } catch (error) {
            console.error('Update user error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to update user', 500);
        }
    }

    async delete(c: Context) {
        try {
            const id = c.req.param('id');

            await this.userService.deleteUser.execute(id);

            return ResSuccess(c, { message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to delete user', 500);
        }
    }

    async getFavorites(c: Context) {
        try {
            const id = c.req.param('id');

            const result = await this.userService.listFavorites.execute(id);

            if (!result.ok) {
                return ResError(c, 'FAVORITES_FAILED', result.error.message, 400);
            }

            const favorites: ModuleSummaryDto[] = result.value.map(module => ({
                id: module.id!,
                name: module.name,
                provider: module.provider,
                level: module.level
            }));

            return ResSuccess(c, favorites);
        } catch (error) {
            console.error('Get favorites error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to retrieve favorites', 500);
        }
    }

    async addFavorite(c: Context) {
        try {
            const userId = c.req.param('id');
            const moduleId = c.req.param('moduleId');

            const result = await this.userService.addFavorite.execute(userId, moduleId);

            if (!result.ok) {
                return ResError(c, 'ADD_FAVORITE_FAILED', result.error.message, 400);
            }

            return ResSuccess(c, result.value);
        } catch (error) {
            console.error('Add favorite error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to add favorite', 500);
        }
    }

    async removeFavorite(c: Context) {
        try {
            const userId = c.req.param('id');
            const moduleId = c.req.param('moduleId');

            const result = await this.userService.removeFavorite.execute(userId, moduleId);

            if (!result.ok) {
                return ResError(c, 'REMOVE_FAVORITE_FAILED', result.error.message, 400);
            }

            return ResSuccess(c, result.value);
        } catch (error) {
            console.error('Remove favorite error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to remove favorite', 500);
        }
    }
}