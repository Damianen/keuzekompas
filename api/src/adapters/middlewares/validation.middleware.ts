import type { Context, Next } from "hono";

export interface ValidationSchema {
    [key: string]: {
        required?: boolean;
        type?: 'string' | 'number' | 'boolean' | 'email';
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: RegExp;
    };
}

export class ValidationMiddleware {
    static validateBody(schema: ValidationSchema) {
        return async (c: Context, next: Next) => {
            try {
                const body = await c.req.json();
                const errors: string[] = [];

                for (const [field, rules] of Object.entries(schema)) {
                    const value = body[field];

                    // Check required fields
                    if (rules.required && (value === undefined || value === null || value === '')) {
                        errors.push(`${field} is required`);
                        continue;
                    }

                    // Skip validation if field is not required and not provided
                    if (!rules.required && (value === undefined || value === null)) {
                        continue;
                    }

                    // Type validation
                    if (rules.type) {
                        switch (rules.type) {
                            case 'string':
                                if (typeof value !== 'string') {
                                    errors.push(`${field} must be a string`);
                                }
                                break;
                            case 'number':
                                if (typeof value !== 'number' || isNaN(value)) {
                                    errors.push(`${field} must be a number`);
                                }
                                break;
                            case 'boolean':
                                if (typeof value !== 'boolean') {
                                    errors.push(`${field} must be a boolean`);
                                }
                                break;
                            case 'email':
                                if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                                    errors.push(`${field} must be a valid email address`);
                                }
                                break;
                        }
                    }

                    // String length validation
                    if (typeof value === 'string') {
                        if (rules.minLength && value.length < rules.minLength) {
                            errors.push(`${field} must be at least ${rules.minLength} characters long`);
                        }
                        if (rules.maxLength && value.length > rules.maxLength) {
                            errors.push(`${field} must be no more than ${rules.maxLength} characters long`);
                        }
                    }

                    // Number range validation
                    if (typeof value === 'number') {
                        if (rules.min !== undefined && value < rules.min) {
                            errors.push(`${field} must be at least ${rules.min}`);
                        }
                        if (rules.max !== undefined && value > rules.max) {
                            errors.push(`${field} must be no more than ${rules.max}`);
                        }
                    }

                    // Pattern validation
                    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
                        errors.push(`${field} has invalid format`);
                    }
                }

                if (errors.length > 0) {
                    return c.json({
                        success: false,
                        error: {
                            code: 'VALIDATION_ERROR',
                            message: 'Validation failed',
                            details: errors
                        }
                    }, 400);
                }

                await next();
            } catch (error) {
                return c.json({
                    success: false,
                    error: {
                        code: 'INVALID_JSON',
                        message: 'Invalid JSON in request body'
                    }
                }, 400);
            }
        };
    }

    static validateParams(schema: ValidationSchema) {
        return async (c: Context, next: Next) => {
            const params = c.req.param();
            const errors: string[] = [];

            for (const [field, rules] of Object.entries(schema)) {
                const value = params[field];

                if (rules.required && !value) {
                    errors.push(`${field} parameter is required`);
                    continue;
                }

                if (value && rules.type === 'number' && isNaN(Number(value))) {
                    errors.push(`${field} parameter must be a number`);
                }

                if (value && rules.pattern && !rules.pattern.test(value)) {
                    errors.push(`${field} parameter has invalid format`);
                }
            }

            if (errors.length > 0) {
                return c.json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Parameter validation failed',
                        details: errors
                    }
                }, 400);
            }

            await next();
        };
    }
}