export interface AppConfig {
    port: number;
    mongoUri: string;
    dbName: string;
    jwtSecret: string;
    saltRounds: number;
    nodeEnv: string;
}

export function getConfig(): AppConfig {
    // Validate required environment variables
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is required');
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
        console.warn('⚠️  WARNING: Using default JWT secret. Change this in production!');
    }

    return {
        port: parseInt(process.env.PORT || '3000'),
        mongoUri: process.env.MONGO_URI,
        dbName: process.env.DB_NAME || 'keuzekompas',
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
        saltRounds: parseInt(process.env.SALT_ROUNDS || '12'),
        nodeEnv: process.env.NODE_ENV || 'development'
    };
}