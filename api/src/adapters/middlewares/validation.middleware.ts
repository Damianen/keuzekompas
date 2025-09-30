import type { Context, Next } from "hono";
import { z, type ZodSchema, type ZodIssue } from "zod";
import { ResError } from "@utils/response.js";

export class ValidationMiddleware {
    static validateBody<T>(schema: ZodSchema<T>) {
        return async (c: Context, next: Next) => {
            try {
                const body = await c.req.json();
                const result = schema.safeParse(body);

                if (!result.success) {
                    const errors = result.error.issues.map((err: ZodIssue) => {
                        const path = err.path.join('.');
                        return path ? `${path}: ${err.message}` : err.message;
                    });

                    return ResError(c, 'VALIDATION_ERROR', 'Validation failed', 400, errors);
                }

                c.set('validatedData', result.data);
                await next();
            } catch (error) {
                return ResError(c, 'INVALID_JSON', 'Invalid JSON in request body', 400);
            }
        };
    }

    static validateParams<T>(schema: ZodSchema<T>) {
        return async (c: Context, next: Next) => {
            const params = c.req.param();
            const result = schema.safeParse(params);

            if (!result.success) {
                const errors = result.error.issues.map((err: ZodIssue) => {
                    const path = err.path.join('.');
                    return path ? `${path} parameter: ${err.message}` : `Parameter: ${err.message}`;
                });

                return ResError(c, 'VALIDATION_ERROR', 'Parameter validation failed', 400, errors);
            }

            c.set('validatedParams', result.data);
            await next();
        };
    }

    static validateQuery<T>(schema: ZodSchema<T>) {
        return async (c: Context, next: Next) => {
            const query = c.req.query();
            const result = schema.safeParse(query);

            if (!result.success) {
                const errors = result.error.issues.map((err: ZodIssue) => {
                    const path = err.path.join('.');
                    return path ? `${path} query parameter: ${err.message}` : `Query parameter: ${err.message}`;
                });

                return ResError(c, 'VALIDATION_ERROR', 'Query parameter validation failed', 400, errors);
            }

            c.set('validatedQuery', result.data);
            await next();
        };
    }
}
