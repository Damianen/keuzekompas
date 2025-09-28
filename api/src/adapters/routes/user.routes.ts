import { Hono } from "hono";
import type { UserController } from "@adapters/controllers/user.controller.js";
import type { AuthMiddleware } from "@adapters/middlewares/auth.middleware.js";
import { ValidationMiddleware } from "@adapters/middlewares/validation.middleware.js";
import {
    registerUserSchema,
    loginUserSchema,
    updateUserSchema,
    idParamSchema
} from "@adapters/validation/dto.schemas.js";

export function createUserRoutes(
    userController: UserController,
    authMiddleware: AuthMiddleware
) {
    const userRoutes = new Hono();

    // Public routes
    userRoutes.post(
        '/register',
        ValidationMiddleware.validateBody(registerUserSchema),
        async (c) => userController.register(c)
    );

    userRoutes.post(
        '/login',
        ValidationMiddleware.validateBody(loginUserSchema),
        async (c) => userController.login(c)
    );

    // Protected routes - require authentication
    userRoutes.use('/*', authMiddleware.authenticate());

    userRoutes.get(
        '/:id',
        ValidationMiddleware.validateParams(idParamSchema),
        authMiddleware.requireOwnership(),
        async (c) => userController.getById(c)
    );

    userRoutes.put(
        '/:id',
        ValidationMiddleware.validateParams(idParamSchema),
        ValidationMiddleware.validateBody(updateUserSchema),
        authMiddleware.requireOwnership(),
        async (c) => userController.update(c)
    );

    userRoutes.delete(
        '/:id',
        ValidationMiddleware.validateParams(idParamSchema),
        authMiddleware.requireOwnership(),
        async (c) => userController.delete(c)
    );

    userRoutes.get(
        '/:id/favorites',
        ValidationMiddleware.validateParams(idParamSchema),
        authMiddleware.requireOwnership(),
        async (c) => userController.getFavorites(c)
    );

    userRoutes.post(
        '/:id/favorites/:moduleId',
        ValidationMiddleware.validateParams(idParamSchema),
        authMiddleware.requireOwnership(),
        async (c) => userController.addFavorite(c)
    );

    userRoutes.delete(
        '/:id/favorites/:moduleId',
        ValidationMiddleware.validateParams(idParamSchema),
        authMiddleware.requireOwnership(),
        async (c) => userController.removeFavorite(c)
    );

    return userRoutes;
}