import mongoose from "mongoose";
import type { IModuleRepo } from "../../domain/repos/module.repo.js";
import type { Module } from "../../domain/entities/Module.js";
import { getModuleModel } from "../models/module.model.js";
import { moduleDocToModule, moduleToModuleDoc } from "../mappers/module.mapper.js";

export class ModuleRepo implements IModuleRepo {
    private moduleModel;

    constructor(connection: mongoose.Connection) {
        this.moduleModel = getModuleModel(connection);
    }

    async upsert(module: Module): Promise<string> {
        const moduleDoc = moduleToModuleDoc(module);

        if (module.id) {
            const updated = await this.moduleModel.findByIdAndUpdate(
                module.id,
                moduleDoc,
                { new: true, upsert: true }
            );
            return updated._id.toString();
        } else {
            const created = await this.moduleModel.create(moduleDoc);
            return created._id.toString();
        }
    }

    async findById(id: string): Promise<Module | null> {
        const doc = await this.moduleModel.findById(id);
        return doc ? moduleDocToModule(doc) : null;
    }

    async getById(id: string): Promise<Module> {
        const doc = await this.moduleModel.findById(id);
        if (!doc) {
            throw new Error(`Module with id ${id} not found`);
        }
        return moduleDocToModule(doc);
    }

    async list(): Promise<Module[]> {
        const docs = await this.moduleModel.find({});
        return docs.map(moduleDocToModule);
    }

    async delete(id: string): Promise<void> {
        await this.moduleModel.findByIdAndDelete(id);
    }
}
