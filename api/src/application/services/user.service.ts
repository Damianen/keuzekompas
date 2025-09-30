import { GetUserById } from "@application/usecases/user/user.getById.js";
import { DeleteUser } from "../usecases/user/user.delete.js";
import { LoginUser } from "../usecases/user/user.login.js";
import { RegisterUser } from "../usecases/user/user.register.js";
import { UpdateUser } from "../usecases/user/user.update.js";
import { ListFavorites } from "@application/usecases/user/user.listfavorites.js";
import { AddFavorite } from "../usecases/user/user.addFavorite.js";
import { RemoveFavorite } from "../usecases/user/user.removeFavorite.js";
import type { IUserRepo } from "@domain/repos/user.repo.js";
import type { IModuleRepo } from "@domain/repos/module.repo.js";
import type { IPasswordHasher } from "@domain/services/IPasswordHasher.js";

export class UserService {
    constructor(public deleteUser: DeleteUser,
        public update: UpdateUser,
        public register: RegisterUser,
        public login: LoginUser,
        public getById: GetUserById,
        public listFavorites: ListFavorites,
        public addFavorite: AddFavorite,
        public removeFavorite: RemoveFavorite) { }

    static createService(repo: IUserRepo, moduleRepo: IModuleRepo, passwordHasher: IPasswordHasher): UserService {
        return new UserService(new DeleteUser(repo),
            new UpdateUser(repo),
            new RegisterUser(repo, passwordHasher),
            new LoginUser(repo, passwordHasher),
            new GetUserById(repo),
            new ListFavorites(repo),
            new AddFavorite(repo, moduleRepo),
            new RemoveFavorite(repo, moduleRepo))
    }
}
