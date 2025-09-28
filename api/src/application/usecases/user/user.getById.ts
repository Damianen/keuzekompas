import type { User } from "@domain/entities/User.js";
import type { IUserRepo } from "@domain/repos/user.repo.js";
import { NotFoundError } from "@shared/error.js";
import { err, ok, type Result } from "@shared/result.js";

export class GetUserById {
    constructor(private repo: IUserRepo) { }

    async execute(id: string): Promise<Result<User>> {
        const user: User | null = await this.repo.findById(id);
        if (!user) return err(new NotFoundError("Id not found"));

        return ok(user);
    }
}
