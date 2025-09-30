import { Hono } from "hono";
import type { ModuleController } from "@adapters/controllers/module.controller.js";
import type { AuthMiddleware } from "@adapters/middlewares/auth.middleware.js";
import { ValidationMiddleware } from "@adapters/middlewares/validation.middleware.js";
import {
    createModuleSchema,
    updateModuleSchema,
    idParamSchema
} from "@adapters/validation/dto.schemas.js";

export function createModuleRoutes(
    moduleController: ModuleController,
    authMiddleware: AuthMiddleware
) {
    const moduleRoutes = new Hono();

    moduleRoutes.get(
        '/',
        async (c) => moduleController.list(c)
    );

    moduleRoutes.get(
        '/:id',
        ValidationMiddleware.validateParams(idParamSchema),
        async (c) => moduleController.getById(c)
    );

    moduleRoutes.use('/*', authMiddleware.authenticate());

    moduleRoutes.post(
        '/',
        authMiddleware.requireRole(2),
        ValidationMiddleware.validateBody(createModuleSchema),
        async (c) => moduleController.create(c)
    );

    moduleRoutes.put(
        '/:id',
        ValidationMiddleware.validateParams(idParamSchema),
        authMiddleware.requireRole(2),
        ValidationMiddleware.validateBody(updateModuleSchema),
        async (c) => moduleController.update(c)
    );

    moduleRoutes.delete(
        '/:id',
        ValidationMiddleware.validateParams(idParamSchema),
        authMiddleware.requireRole(2),
        async (c) => moduleController.delete(c)
    );

    return moduleRoutes;
}
