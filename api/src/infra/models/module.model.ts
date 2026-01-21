import mongoose, { Schema, Model, type InferSchemaType, Types } from 'mongoose';

const ModuleSchema = new Schema(
	{
		name: String,
		shortdescription: String,
		description: String,
		content: String,
		studycredit: Number,
		location: String,
		contact_id: Number,
		level: String,
		learningoutcomes: String,
	},
	{ versionKey: false }
);

ModuleSchema.index({ name: 'text', description: 'text', information: 'text' });

export type ModuleDoc = InferSchemaType<typeof ModuleSchema> & { _id: Types.ObjectId };

export function getModuleModel(conn: mongoose.Connection): Model<ModuleDoc> {
	return conn.model<ModuleDoc>('Module', ModuleSchema, 'modules');
}
