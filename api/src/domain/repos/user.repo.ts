import type { Module } from "../entities/Module.js";
import type { User } from "../entities/User.js";

export interface IUserRepo {
    upsert(user: User): Promise<string>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    listFavorites(id: string): Promise<Module[]>;
    addFavorite(userId: string, moduleId: string): Promise<void>;
    removeFavorite(userId: string, moduleId: string): Promise<void>;
    delete(id: string): Promise<void>;
}
