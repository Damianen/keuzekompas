import type { User } from "@domain/entities/User.js";
import type { IUserRepo } from "@domain/repos/user.repo.js";
import { NotFoundError, ValidationError } from "@shared/error.js";
import { err, ok, type Result } from "@shared/result.js";
import type { IPasswordHasher } from "../../../domain/services/IPasswordHasher.js";

export class LoginUser {
    constructor(private repo: IUserRepo, private passwordHasher: IPasswordHasher) { }

    async execute(input: { email: string, password: string }): Promise<Result<{ id: string }>> {
        const user: User | null = await this.repo.findByEmail(input.email);
        if (!user) return err(new NotFoundError("Invalid Credentials"));

        const valid = await this.passwordHasher.verify(input.password, user.passwordHash);
        if (!valid) return err(new ValidationError("Invalid Credentials"));

        return ok({ id: user.id! })
    }
}
