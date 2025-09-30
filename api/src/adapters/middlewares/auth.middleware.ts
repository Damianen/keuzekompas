import type { Context, Next } from "hono";
import type { IJwtService } from "../../domain/services/IJwtService.js";
import type { IUserRepo } from "../../domain/repos/user.repo.js";
import { ResError } from "@utils/response.js";

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: number;
}

declare module "hono" {
    interface ContextVariableMap {
        user: AuthenticatedUser;
    }
}

export class AuthMiddleware {
    constructor(
        private jwtService: IJwtService,
        private userRepo: IUserRepo
    ) { }

    authenticate() {
        return async (c: Context, next: Next) => {
            try {
                const authHeader = c.req.header('Authorization');

                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return ResError(c, 'UNAUTHORIZED', 'Missing or invalid authorization header', 401);
                }

                const token = authHeader.substring(7); // Remove 'Bearer ' prefix

                const payload = await this.jwtService.verify<{ userId: string }>(token);

                if (!payload || !payload.userId) {
                    return ResError(c, 'INVALID_TOKEN', 'Invalid token payload', 401);
                }

                const user = await this.userRepo.findById(payload.userId);

                if (!user) {
                    return ResError(c, 'USER_NOT_FOUND', 'User not found', 401);
                }

                c.set('user', {
                    id: user.id!,
                    email: user.email,
                    role: user.role
                });

                await next();
            } catch (error) {
                console.error('Authentication error:', error);

                return ResError(c, 'AUTHENTICATION_FAILED', 'Authentication failed', 401);
            }
        };
    }

    requireRole(requiredRole: number) {
        return async (c: Context, next: Next) => {
            const user = c.get('user');

            if (!user) {
                return ResError(c, 'UNAUTHORIZED', 'Authentication required', 401);
            }

            if (user.role < requiredRole) {
                return ResError(c, 'FORBIDDEN', 'Insufficient permissions', 403);
            }

            await next();
        };
    }

    requireOwnership() {
        return async (c: Context, next: Next) => {
            const user = c.get('user');
            const resourceUserId = c.req.param('id') || c.req.query('userId');

            if (!user) {
                return ResError(c, 'UNAUTHORIZED', 'Authentication required', 401);
            }

            // Allow if user is admin (role === 2) or owns the resource
            if (user.role === 2 || user.id === resourceUserId) {
                await next();
                return;
            }

            return ResError(c, 'FORBIDDEN', 'Access denied: insufficient permissions', 403);
        };
    }
}
