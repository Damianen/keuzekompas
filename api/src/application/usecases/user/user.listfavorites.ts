import type { Module } from "@domain/entities/Module.js";
import type { IUserRepo } from "@domain/repos/user.repo.js";
import { NotFoundError } from "@shared/error.js";
import { err, ok, type Result } from "@shared/result.js";

export class ListFavorites {
    constructor(private repo: IUserRepo) { }

    async execute(id: string): Promise<Result<Module[]>> {
        const user = await this.repo.findById(id);
        if (!user) return err(new NotFoundError("Id not found"));

        const modules: Module[] = await this.repo.listFavorites(id);
        return ok(modules);
    }
}
