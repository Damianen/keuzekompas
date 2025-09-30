import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { createUserRoutes } from './adapters/routes/user.routes.js';
import { createModuleRoutes } from './adapters/routes/module.routes.js';
import { ErrorMiddleware } from '@adapters/middlewares/error.middleware.js';
import { createMongooseConnection } from '@infra/db/connect.js';
import { UserRepo } from '@infra/repos/user.repo.js';
import { ModuleRepo } from '@infra/repos/module.repo.js';
import { UserService } from '@application/services/user.service.js';
import { PasswordHasher } from '@infra/services/PasswordHasher.js';
import { ModuleService } from '@application/services/module.service.js';
import { UserController } from '@adapters/controllers/user.controller.js';
import { JwtService } from '@infra/services/JwtService.js';
import { ModuleController } from '@adapters/controllers/module.controller.js';
import { AuthMiddleware } from '@adapters/middlewares/auth.middleware.js';

const app = new Hono();

const conn = await createMongooseConnection(process.env.MONGO_URI!, process.env.DB_NAME!);
const userRepo = new UserRepo(conn);
const moduleRepo = new ModuleRepo(conn);
const passwordHasher = new PasswordHasher();
const userService = UserService.createService(userRepo, moduleRepo, passwordHasher);
const moduleService = ModuleService.createService(moduleRepo);
const jwtService = new JwtService(process.env.JWT_KEY!);
const userController = new UserController(userService, jwtService);
const moduleController = new ModuleController(moduleService);
const authMiddleware = new AuthMiddleware(jwtService, userRepo);

app.use('*', logger());
app.use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));

app.use('*', ErrorMiddleware.errorHandler());

app.get('/health', (c) => {
    return c.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        }
    });
});

const apiRoutes = new Hono();

const userRoutes = createUserRoutes(userController, authMiddleware);
apiRoutes.route('/users', userRoutes);

const moduleRoutes = createModuleRoutes(moduleController, authMiddleware);
apiRoutes.route('/modules', moduleRoutes);

app.route('/api', apiRoutes);

app.notFound(ErrorMiddleware.notFoundHandler());

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT!)
}, () => { console.log(`app running at localhost:${process.env.PORT!}!`); });

