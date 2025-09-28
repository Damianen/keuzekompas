import bcrypt from "bcrypt";
import type { IPasswordHasher } from "../../domain/services/IPasswordHasher.js";

export class PasswordHasher implements IPasswordHasher {
    private readonly saltRounds: number;

    constructor(saltRounds: number = 12) {
        this.saltRounds = saltRounds;
    }

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async verify(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
