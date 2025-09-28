import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Configuration
import { getConfig } from './config/env.js';

// Container
import { createContainer } from './infra/container.js';

// Routes
import { createUserRoutes } from './adapters/routes/user.routes.js';
import { createModuleRoutes } from './adapters/routes/module.routes.js';

async function startServer() {
    try {
        console.log('🚀 Starting Keuzekompas API...');

        // Load configuration
        console.log('📋 Loading configuration...');
        const config = getConfig();
        console.log(`   Environment: ${config.nodeEnv}`);
        console.log(`   Port: ${config.port}`);
        console.log(`   Database: ${config.dbName}`);

        // Initialize dependencies
        console.log('⚙️  Initializing dependencies...');
        console.log('   Connecting to MongoDB...');
        const container = await createContainer({
            mongoUri: config.mongoUri,
            dbName: config.dbName,
            jwtSecret: config.jwtSecret,
            saltRounds: config.saltRounds
        });
        console.log('✅ Dependencies initialized successfully');

        // Create Hono app
        console.log('🔧 Setting up Hono application...');
        const app = new Hono();

        // Global middlewares
        console.log('   Adding global middlewares...');
        app.use('*', logger());
        app.use('*', cors({
            origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
            credentials: true,
        }));

        // Global error handler
        app.use('*', container.errorMiddleware.errorHandler());

        // Health check endpoint
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

        // API routes
        console.log('🛣️  Setting up routes...');
        const apiRoutes = new Hono();

        // Mount user routes
        console.log('   Creating user routes...');
        const userRoutes = createUserRoutes(container.userController, container.authMiddleware);
        apiRoutes.route('/users', userRoutes);

        // Mount module routes
        console.log('   Creating module routes...');
        const moduleRoutes = createModuleRoutes(container.moduleController, container.authMiddleware);
        apiRoutes.route('/modules', moduleRoutes);

        // Mount API routes under /api prefix
        app.route('/api', apiRoutes);
        console.log('✅ Routes configured successfully');

        // Welcome endpoint
        app.get('/', (c) => {
            return c.json({
                success: true,
                data: {
                    message: 'Welcome to Keuzekompas API',
                    version: '1.0.0',
                    docs: '/api/health',
                    endpoints: {
                        health: 'GET /health',
                        users: 'POST /api/users/register, POST /api/users/login',
                        modules: 'GET /api/modules'
                    }
                }
            });
        });

        // 404 handler
        app.notFound(container.errorMiddleware.notFoundHandler());

        // Start server
        console.log('🌐 Starting HTTP server...');
        const server = serve({
            fetch: app.fetch,
            port: config.port
        }, (info) => {
            console.log('🎉 Server started successfully!');
            console.log(`🚀 Keuzekompas API running on http://localhost:${info.port}`);
            console.log(`🏥 Health check: http://localhost:${info.port}/health`);
            console.log(`📚 API base: http://localhost:${info.port}/api`);
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await container.dbConnection.close();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await container.dbConnection.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
console.log('🔄 Initializing server startup...');
startServer().catch((error) => {
    console.error('💥 Unhandled startup error:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
});
