import type { Context, Next } from "hono";
import { NotFoundError, ValidationError } from "../../shared/error.js";
import { ResError } from "@utils/response.js";

export class ErrorMiddleware {
    static errorHandler() {
        return async (c: Context, next: Next) => {
            try {
                await next();
            } catch (error) {
                console.error('Unhandled error:', error);

                if (error instanceof ValidationError) {
                    return ResError(c, 'VALIDATION_ERROR', error.message, 400);
                }

                if (error instanceof NotFoundError) {
                    return ResError(c, 'NOT_FOUND', error.message, 404);
                }

                if (error instanceof Error) {
                    if (error.name === 'JsonWebTokenError') {
                        return ResError(c, 'INVALID_TOKEN', 'Invalid token', 401);
                    }

                    if (error.name === 'TokenExpiredError') {
                        return ResError(c, 'TOKEN_EXPIRED', 'Token has expired', 401);
                    }
                }

                return ResError(c, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred', 500);
            }
        };
    }

    static notFoundHandler() {
        return (c: Context) => {
            return ResError(c, 'ROUTE_NOT_FOUND', `Route ${c.req.method} ${c.req.path} not found`, 404);
        };
    }
}
