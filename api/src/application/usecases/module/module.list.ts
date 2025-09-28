import type { Module } from "@domain/entities/Module.js";
import type { IModuleRepo } from "@domain/repos/module.repo.js";
import { ok, type Result } from "@shared/result.js";

export class ListModules {
    constructor(private repo: IModuleRepo) { }

    async execute(): Promise<Result<Module[]>> {
        const modules: Module[] = await this.repo.list();
        return ok(modules);
    }
}
