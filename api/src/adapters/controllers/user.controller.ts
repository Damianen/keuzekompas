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
                return c.json({
                    success: false,
                    error: {
                        code: 'REGISTRATION_FAILED',
                        message: result.error.message
                    }
                }, 400);
            }

            const response: ApiSuccessResponse<CreateResponse> = {
                success: true,
                data: {
                    id: result.value.id,
                    message: 'User registered successfully'
                }
            };

            return c.json(response, 201);
        } catch (error) {
            console.error('Registration error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Registration failed'
                }
            }, 500);
        }
    }

    async login(c: Context) {
        try {
            const body: LoginUserDto = await c.req.json();

            const result = await this.userService.login.execute(body);

            if (!result.ok) {
                return c.json({
                    success: false,
                    error: {
                        code: 'LOGIN_FAILED',
                        message: result.error.message
                    }
                }, 401);
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

            const response: ApiSuccessResponse<AuthResponseDto> = {
                success: true,
                data: authResponse,
                message: 'Login successful'
            };

            return c.json(response);
        } catch (error) {
            console.error('Login error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Login failed'
                }
            }, 500);
        }
    }

    async getById(c: Context) {
        try {
            const id = c.req.param('id');

            const result = await this.userService.getById.execute(id);

            if (!result.ok) {
                return c.json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: result.error.message
                    }
                }, 404);
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

            const response: ApiSuccessResponse<UserResponseDto> = {
                success: true,
                data: userResponse
            };

            return c.json(response);
        } catch (error) {
            console.error('Get user error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to retrieve user'
                }
            }, 500);
        }
    }

    async update(c: Context) {
        try {
            const id = c.req.param('id');
            const body: Partial<UpdateUserDto> = await c.req.json();

            const updateData = { ...body, id };

            const result = await this.userService.update.execute(updateData as any);

            if (!result.ok) {
                return c.json({
                    success: false,
                    error: {
                        code: 'UPDATE_FAILED',
                        message: result.error.message
                    }
                }, 400);
            }

            const response: ApiSuccessResponse<CreateResponse> = {
                success: true,
                data: {
                    id: result.value.id,
                    message: 'User updated successfully'
                }
            };

            return c.json(response);
        } catch (error) {
            console.error('Update user error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to update user'
                }
            }, 500);
        }
    }

    async delete(c: Context) {
        try {
            const id = c.req.param('id');

            await this.userService.deleteUser.execute(id);

            const response: ApiSuccessResponse<{ message: string }> = {
                success: true,
                data: { message: 'User deleted successfully' }
            };

            return c.json(response);
        } catch (error) {
            console.error('Delete user error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to delete user'
                }
            }, 500);
        }
    }

    async getFavorites(c: Context) {
        try {
            const id = c.req.param('id');

            const result = await this.userService.listFavorites.execute(id);

            if (!result.ok) {
                return c.json({
                    success: false,
                    error: {
                        code: 'FAVORITES_FAILED',
                        message: result.error.message
                    }
                }, 400);
            }

            const favorites: ModuleSummaryDto[] = result.value.map(module => ({
                id: module.id!,
                name: module.name,
                provider: module.provider,
                level: module.level
            }));

            const response: ApiSuccessResponse<ModuleSummaryDto[]> = {
                success: true,
                data: favorites
            };

            return c.json(response);
        } catch (error) {
            console.error('Get favorites error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to retrieve favorites'
                }
            }, 500);
        }
    }

    async addFavorite(c: Context) {
        try {
            const userId = c.req.param('id');
            const moduleId = c.req.param('moduleId');

            const result = await this.userService.addFavorite.execute(userId, moduleId);

            if (!result.ok) {
                return c.json({
                    success: false,
                    error: {
                        code: 'ADD_FAVORITE_FAILED',
                        message: result.error.message
                    }
                }, 400);
            }

            const response: ApiSuccessResponse<{ message: string }> = {
                success: true,
                data: result.value
            };

            return c.json(response);
        } catch (error) {
            console.error('Add favorite error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to add favorite'
                }
            }, 500);
        }
    }

    async removeFavorite(c: Context) {
        try {
            const userId = c.req.param('id');
            const moduleId = c.req.param('moduleId');

            const result = await this.userService.removeFavorite.execute(userId, moduleId);

            if (!result.ok) {
                return c.json({
                    success: false,
                    error: {
                        code: 'REMOVE_FAVORITE_FAILED',
                        message: result.error.message
                    }
                }, 400);
            }

            const response: ApiSuccessResponse<{ message: string }> = {
                success: true,
                data: result.value
            };

            return c.json(response);
        } catch (error) {
            console.error('Remove favorite error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to remove favorite'
                }
            }, 500);
        }
    }
}