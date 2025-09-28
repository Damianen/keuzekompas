import mongoose from "mongoose";

export async function createMongooseConnection(uri: string, dbName: string): Promise<mongoose.Connection> {
    try {
        console.log('   Checking for existing connection...');
        const existing = mongoose.connections.find((c) => c.name === dbName && c.readyState === 1);
        if (existing) {
            console.log('   Using existing connection');
            return existing;
        }

        console.log('   Creating new MongoDB connection...');
        console.log(`   URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in logs
        console.log(`   Database: ${dbName}`);

        const conn = await mongoose.createConnection(uri, {
            dbName,
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false // Disable mongoose buffering
        }).asPromise();

        console.log('   ✅ MongoDB connection established successfully');
        console.log(`   Connection state: ${conn.readyState}`);

        return conn;
    } catch (error: unknown) {
        console.error('   ❌ MongoDB connection failed:');

        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = String((error as { message: unknown }).message);
        }

        console.error('   Error:', errorMessage);

        if (errorMessage.includes('ECONNREFUSED')) {
            console.error('   → Database server is not reachable');
        } else if (errorMessage.includes('authentication failed')) {
            console.error('   → Check your username and password');
        } else if (errorMessage.includes('bad auth')) {
            console.error('   → Authentication credentials are invalid');
        } else if (errorMessage.includes('ENOTFOUND')) {
            console.error('   → DNS resolution failed - check your connection string');
        }

        throw error;
    }
}
