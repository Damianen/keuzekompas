import { z } from "zod";

export const registerUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be no more than 50 characters"),
    study: z.string().min(2, "Study must be at least 2 characters").max(100, "Study must be no more than 100 characters"),
    password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be no more than 100 characters"),
    role: z.number().min(1, "Role must be at least 1").max(10, "Role must be no more than 10").optional()
});

export const loginUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

export const updateUserSchema = z.object({
    email: z.string().email("Invalid email address").optional(),
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be no more than 50 characters").optional(),
    study: z.string().min(2, "Study must be at least 2 characters").max(100, "Study must be no more than 100 characters").optional(),
    role: z.number().min(1, "Role must be at least 1").max(10, "Role must be no more than 10").optional()
});

export const createModuleSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(200, "Name must be no more than 200 characters"),
    location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location must be no more than 100 characters"),
    period: z.number().min(1, "Period must be at least 1").max(12, "Period must be no more than 12"),
    provider: z.string().min(2, "Provider must be at least 2 characters").max(100, "Provider must be no more than 100 characters"),
    duration: z.number().min(1, "Duration must be at least 1").max(1000, "Duration must be no more than 1000"),
    language: z.string().min(2, "Language must be at least 2 characters").max(50, "Language must be no more than 50 characters"),
    level: z.string().min(1, "Level must be at least 1 character").max(50, "Level must be no more than 50 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be no more than 1000 characters"),
    information: z.string().min(10, "Information must be at least 10 characters").max(2000, "Information must be no more than 2000 characters")
});

export const updateModuleSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(200, "Name must be no more than 200 characters").optional(),
    location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location must be no more than 100 characters").optional(),
    period: z.number().min(1, "Period must be at least 1").max(12, "Period must be no more than 12").optional(),
    provider: z.string().min(2, "Provider must be at least 2 characters").max(100, "Provider must be no more than 100 characters").optional(),
    duration: z.number().min(1, "Duration must be at least 1").max(1000, "Duration must be no more than 1000").optional(),
    language: z.string().min(2, "Language must be at least 2 characters").max(50, "Language must be no more than 50 characters").optional(),
    level: z.string().min(1, "Level must be at least 1 character").max(50, "Level must be no more than 50 characters").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be no more than 1000 characters").optional(),
    information: z.string().min(10, "Information must be at least 10 characters").max(2000, "Information must be no more than 2000 characters").optional()
});

export const idParamSchema = z.object({
    id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB ObjectId format")
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type CreateModuleDto = z.infer<typeof createModuleSchema>;
export type UpdateModuleDto = z.infer<typeof updateModuleSchema>;
export type IdParamDto = z.infer<typeof idParamSchema>;
