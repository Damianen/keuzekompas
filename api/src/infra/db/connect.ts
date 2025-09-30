import mongoose from "mongoose";

export async function createMongooseConnection(uri: string, dbName: string): Promise<mongoose.Connection> {
    const existing = mongoose.connections.find((c) => c.name === dbName && c.readyState === 1);
    if (existing) {
        return existing;
    }
    const conn = await mongoose.createConnection(uri, { dbName }).asPromise();

    return conn;
}
