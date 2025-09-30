import { CreateModule } from "@application/usecases/module/module.create.js";
import { DeleteModule } from "@application/usecases/module/module.delete.js";
import { GetModuleById } from "@application/usecases/module/module.getById.js";
import { ListModules } from "@application/usecases/module/module.list.js";
import { UpdateModule } from "@application/usecases/module/module.update.js";
import type { IModuleRepo } from "@domain/repos/module.repo.js";

export class ModuleService {
    constructor(public deleteModule: DeleteModule,
        public update: UpdateModule,
        public create: CreateModule,
        public list: ListModules,
        public getById: GetModuleById) { }

    static createService(repo: IModuleRepo): ModuleService {
        return new ModuleService(new DeleteModule(repo),
            new UpdateModule(repo),
            new CreateModule(repo),
            new ListModules(repo),
            new GetModuleById(repo))
    }
}
