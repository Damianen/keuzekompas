import type { Module } from "@domain/entities/Module.js";
import type { IModuleRepo } from "@domain/repos/module.repo.js";
import { NotFoundError } from "@shared/error.js";
import { err, ok, type Result } from "@shared/result.js";

export class GetModuleById {
    constructor(private repo: IModuleRepo) { }

    async execute(id: string): Promise<Result<Module>> {
        const mod = await this.repo.getById(id);
        if (!mod) return err(new NotFoundError("Id not found"));

        return ok(mod);
    }
}
