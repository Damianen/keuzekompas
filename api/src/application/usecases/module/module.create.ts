import type { Module } from "@domain/entities/Module.js";
import type { IModuleRepo } from "@domain/repos/module.repo.js";
import { ok, type Result } from "@shared/result.js";

export class CreateModule {
    constructor(private repo: IModuleRepo) { }

    async execute(module: Omit<Module, "id">): Promise<Result<{ id: string }>> {
        const id: string = await this.repo.upsert(module);
        return ok({ id: id });
    }
}
