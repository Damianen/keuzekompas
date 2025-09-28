import type { Context, Next } from "hono";
import { NotFoundError, ValidationError } from "../../shared/error.js";

export class ErrorMiddleware {
    static errorHandler() {
        return async (c: Context, next: Next) => {
            try {
                await next();
            } catch (error) {
                console.error('Unhandled error:', error);

                // Handle known application errors
                if (error instanceof ValidationError) {
                    return c.json({
                        success: false,
                        error: {
                            code: 'VALIDATION_ERROR',
                            message: error.message
                        }
                    }, 400);
                }

                if (error instanceof NotFoundError) {
                    return c.json({
                        success: false,
                        error: {
                            code: 'NOT_FOUND',
                            message: error.message
                        }
                    }, 404);
                }

                // Handle JWT errors
                if (error instanceof Error) {
                    if (error.name === 'JsonWebTokenError') {
                        return c.json({
                            success: false,
                            error: {
                                code: 'INVALID_TOKEN',
                                message: 'Invalid token'
                            }
                        }, 401);
                    }

                    if (error.name === 'TokenExpiredError') {
                        return c.json({
                            success: false,
                            error: {
                                code: 'TOKEN_EXPIRED',
                                message: 'Token has expired'
                            }
                        }, 401);
                    }
                }

                // Handle generic errors
                return c.json({
                    success: false,
                    error: {
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An unexpected error occurred'
                    }
                }, 500);
            }
        };
    }

    static notFoundHandler() {
        return (c: Context) => {
            return c.json({
                success: false,
                error: {
                    code: 'ROUTE_NOT_FOUND',
                    message: `Route ${c.req.method} ${c.req.path} not found`
                }
            }, 404);
        };
    }
}