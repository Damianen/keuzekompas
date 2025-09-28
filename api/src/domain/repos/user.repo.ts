import type { Module } from "../entities/Module.js";
import type { User } from "../entities/User.js";

export interface IUserRepo {
    upsert(user: User): Promise<string | null>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    listFavorites(id: string): Promise<Module[] | null>;
    delete(id: string): Promise<void>;
}
