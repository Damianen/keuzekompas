import type { IUserRepo } from "../../domain/repos/user.repo.js";
import { err, ok, type Result } from "../../shared/result.js";
import { ValidationError } from "../../shared/error.js";
import type { IPasswordHasher } from "../ports/passwordhasher.port.js";
import type { User } from "../../domain/entities/User.js";

export class RegisterUser {
    constructor(private repo: IUserRepo, private passwordHasher: IPasswordHasher) { }

    async execute(input: { email: string, name: string, study: string, password: string, role: number }): Promise<Result<{ id: string }>> {
        const exists = await this.repo.findByEmail(input.email);
        if (exists) return err(new ValidationError("Email already registered"));

        const passwordHash: string = await this.passwordHasher.hash(input.password);

        const user: User = {
            email: input.email,
            name: input.name,
            study: input.study,
            passwordHash: passwordHash,
            role: input.role,
            favorites: [],
            createdAt: new Date()
        }

        const id: string | null = await this.repo.upsert(user);
        return ok({ id: id! })
    }
}
