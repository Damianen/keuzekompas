import type { Module } from "../entities/Module.js";

export interface IModuleRepo {
    upsert(module: Module): Promise<void>;
    getById(id: string): Promise<Module>;
    list(): Promise<Module[]>;
    delete(id: string): Promise<void>;
}
