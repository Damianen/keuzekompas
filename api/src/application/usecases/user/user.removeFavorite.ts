import type { IUserRepo } from "@domain/repos/user.repo.js";
import type { IModuleRepo } from "@domain/repos/module.repo.js";
import { err, ok, type Result } from "@shared/result.js";
import { NotFoundError } from "@shared/error.js";

export class RemoveFavorite {
    constructor(private userRepo: IUserRepo, private moduleRepo: IModuleRepo) { }

    async execute(userId: string, moduleId: string): Promise<Result<{ message: string }>> {
        const user = await this.userRepo.findById(userId);
        if (!user) return err(new NotFoundError("User not found"));

        const module = await this.moduleRepo.findById(moduleId);
        if (!module) return err(new NotFoundError("Module not found"));

        await this.userRepo.removeFavorite(userId, moduleId);
        return ok({ message: "Module removed from favorites" });
    }
}