import type { Module } from "@domain/entities/Module.js";
import type { IModuleRepo } from "@domain/repos/module.repo.js";
import { NotFoundError } from "@shared/error.js";
import { err, ok, type Result } from "@shared/result.js";

export class UpdateModule {
    constructor(private repo: IModuleRepo) { }

    async execute(module: Module): Promise<Result<{ id: string }>> {
        const mod: Module | null = await this.repo.getById(module.id!);
        if (!mod) return err(new NotFoundError("id not found"));

        const id: string = await this.repo.upsert(module);
        return ok({ id: id });
    }
}
