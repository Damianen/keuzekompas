import type { User } from "@domain/entities/User.js";
import type { IUserRepo } from "@domain/repos/user.repo.js";
import { NotFoundError } from "@shared/error.js";
import { err, ok, type Result } from "@shared/result.js";

export class UpdateUser {
    constructor(private repo: IUserRepo) { }

    async execute(data: User): Promise<Result<{ id: string }>> {
        const user: User | null = await this.repo.findById(data.id!);
        if (!user) return err(new NotFoundError("Id not found"));

        const id: string | null = await this.repo.upsert(data);
        return ok({ id: id! });
    }
}
