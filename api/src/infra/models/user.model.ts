import mongoose, { Schema, Model, type InferSchemaType, Types } from "mongoose";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    study: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: Number, required: true, default: 1 },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Module", default: [] }],
    createdAt: { type: Date, required: true, default: () => new Date() },
}, { versionKey: false });

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: Types.ObjectId };

export function getUserModel(conn: mongoose.Connection): Model<UserDoc> {
    return conn.model<UserDoc>("User", UserSchema, "users");
}

