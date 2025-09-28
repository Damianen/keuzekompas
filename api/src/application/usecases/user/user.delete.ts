import type { IUserRepo } from "@domain/repos/user.repo.js";

export class DeleteUser {
    constructor(private repo: IUserRepo) { }

    async execute(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
