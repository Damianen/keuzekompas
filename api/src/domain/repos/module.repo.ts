import type { Module } from "../entities/Module.js";

export interface IModuleRepo {
    upsert(module: Module): Promise<string>;
    findById(id: string): Promise<Module | null>;
    getById(id: string): Promise<Module>;
    list(): Promise<Module[]>;
    delete(id: string): Promise<void>;
}
