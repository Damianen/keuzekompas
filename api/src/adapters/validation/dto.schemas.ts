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
    shortdescription: z.string().min(10, "Short description must be at least 10 characters").max(500, "Short description must be no more than 500 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be no more than 2000 characters"),
    content: z.string().min(10, "Content must be at least 10 characters").max(5000, "Content must be no more than 5000 characters"),
    studycredit: z.number().min(1, "Study credit must be at least 1").max(60, "Study credit must be no more than 60"),
    location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location must be no more than 100 characters"),
    contact_id: z.number().min(1, "Contact ID must be at least 1"),
    level: z.string().min(1, "Level must be at least 1 character").max(50, "Level must be no more than 50 characters"),
    learningoutcomes: z.string().min(10, "Learning outcomes must be at least 10 characters").max(3000, "Learning outcomes must be no more than 3000 characters")
});

export const updateModuleSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(200, "Name must be no more than 200 characters").optional(),
    shortdescription: z.string().min(10, "Short description must be at least 10 characters").max(500, "Short description must be no more than 500 characters").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be no more than 2000 characters").optional(),
    content: z.string().min(10, "Content must be at least 10 characters").max(5000, "Content must be no more than 5000 characters").optional(),
    studycredit: z.number().min(1, "Study credit must be at least 1").max(60, "Study credit must be no more than 60").optional(),
    location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location must be no more than 100 characters").optional(),
    contact_id: z.number().min(1, "Contact ID must be at least 1").optional(),
    level: z.string().min(1, "Level must be at least 1 character").max(50, "Level must be no more than 50 characters").optional(),
    learningoutcomes: z.string().min(10, "Learning outcomes must be at least 10 characters").max(3000, "Learning outcomes must be no more than 3000 characters").optional()
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
