import type { ValidationSchema } from "@adapters/middlewares/validation.middleware.js";

// User DTO validation schemas
export const registerUserSchema: ValidationSchema = {
    email: { required: true, type: 'email' },
    name: { required: true, type: 'string', minLength: 2, maxLength: 50 },
    study: { required: true, type: 'string', minLength: 2, maxLength: 100 },
    password: { required: true, type: 'string', minLength: 8, maxLength: 100 },
    role: { required: false, type: 'number', min: 1, max: 10 }
};

export const loginUserSchema: ValidationSchema = {
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string', minLength: 1 }
};

export const updateUserSchema: ValidationSchema = {
    email: { type: 'email' },
    name: { type: 'string', minLength: 2, maxLength: 50 },
    study: { type: 'string', minLength: 2, maxLength: 100 },
    role: { type: 'number', min: 1, max: 10 }
};

// Module DTO validation schemas
export const createModuleSchema: ValidationSchema = {
    name: { required: true, type: 'string', minLength: 2, maxLength: 200 },
    location: { required: true, type: 'string', minLength: 2, maxLength: 100 },
    period: { required: true, type: 'number', min: 1, max: 12 },
    provider: { required: true, type: 'string', minLength: 2, maxLength: 100 },
    duration: { required: true, type: 'number', min: 1, max: 1000 },
    language: { required: true, type: 'string', minLength: 2, maxLength: 50 },
    level: { required: true, type: 'string', minLength: 1, maxLength: 50 },
    description: { required: true, type: 'string', minLength: 10, maxLength: 1000 },
    information: { required: true, type: 'string', minLength: 10, maxLength: 2000 }
};

export const updateModuleSchema: ValidationSchema = {
    name: { type: 'string', minLength: 2, maxLength: 200 },
    location: { type: 'string', minLength: 2, maxLength: 100 },
    period: { type: 'number', min: 1, max: 12 },
    provider: { type: 'string', minLength: 2, maxLength: 100 },
    duration: { type: 'number', min: 1, max: 1000 },
    language: { type: 'string', minLength: 2, maxLength: 50 },
    level: { type: 'string', minLength: 1, maxLength: 50 },
    description: { type: 'string', minLength: 10, maxLength: 1000 },
    information: { type: 'string', minLength: 10, maxLength: 2000 }
};

// Common parameter schemas
export const idParamSchema: ValidationSchema = {
    id: { required: true, type: 'string', pattern: /^[a-fA-F0-9]{24}$/ } // MongoDB ObjectId pattern
};