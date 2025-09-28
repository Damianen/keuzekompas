import mongoose, { Schema, Model, type InferSchemaType, Types } from "mongoose";

const ModuleSchema = new Schema({
    name: String, location: String, period: Number, provider: String,
    duration: Number, language: String, level: String,
    description: String, information: String,
    createdAt: { type: Date, default: () => new Date(), required: true },
}, { versionKey: false });

ModuleSchema.index({ name: "text", description: "text", information: "text" });

export type ModuleDoc = InferSchemaType<typeof ModuleSchema> & { _id: Types.ObjectId };

export function getModuleModel(conn: mongoose.Connection): Model<ModuleDoc> {
    return conn.model<ModuleDoc>("Module", ModuleSchema, "modules");
}

