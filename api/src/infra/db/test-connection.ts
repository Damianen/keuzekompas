import mongoose from "mongoose";

export async function testMongoConnection(uri: string, dbName: string): Promise<boolean> {
    console.log('🔍 Testing MongoDB connection...');

    try {
        // Extract host from URI for basic connectivity test
        const hostname = uri.match(/@([^\/]+)/)?.[1] || 'unknown';
        console.log(`   Target: ${hostname}`);

        // Try a quick connection test
        const testConn = await mongoose.createConnection(uri, {
            dbName,
            serverSelectionTimeoutMS: 5000, // 5 second timeout for test
            connectTimeoutMS: 10000,
            socketTimeoutMS: 10000
        }).asPromise();

        await testConn.close();
        console.log('   ✅ Connection test successful');
        return true;
    } catch (error: unknown) {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = String((error as { message: unknown }).message);
        }

        console.error('   ❌ Connection test failed:', errorMessage);

        // Provide helpful hints based on error type
        if (errorMessage.includes('ENOTFOUND')) {
            console.error('   💡 Hint: Check if your internet connection is working');
            console.error('   💡 Hint: Verify the MongoDB Atlas cluster hostname');
        } else if (errorMessage.includes('authentication failed') || errorMessage.includes('bad auth')) {
            console.error('   💡 Hint: Check your MongoDB Atlas username and password');
            console.error('   💡 Hint: Ensure the database user has proper permissions');
        } else if (errorMessage.includes('IP whitelist')) {
            console.error('   💡 Hint: Add your IP address to MongoDB Atlas whitelist');
            console.error('   💡 Hint: Or set whitelist to 0.0.0.0/0 for development');
        } else if (errorMessage.includes('timeout')) {
            console.error('   💡 Hint: Network connectivity issue or slow connection');
            console.error('   💡 Hint: Check your firewall settings');
        }

        return false;
    }
}