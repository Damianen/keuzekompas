import type { IModuleRepo } from "@domain/repos/module.repo.js";

export class DeleteModule {
    constructor(private repo: IModuleRepo) { }

    async execute(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
