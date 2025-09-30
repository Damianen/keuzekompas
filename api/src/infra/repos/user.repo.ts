import mongoose from "mongoose";
import type { IUserRepo } from "../../domain/repos/user.repo.js";
import type { User } from "../../domain/entities/User.js";
import type { Module } from "../../domain/entities/Module.js";
import { getUserModel } from "../models/user.model.js";
import { getModuleModel, type ModuleDoc } from "../models/module.model.js";
import { userDocToUser, userToUserDoc, moduleDocToModule } from "../mappers/user.mapper.js";

export class UserRepo implements IUserRepo {
    private userModel;
    private moduleModel;

    constructor(connection: mongoose.Connection) {
        this.userModel = getUserModel(connection);
        this.moduleModel = getModuleModel(connection);
    }

    async upsert(user: User): Promise<string> {
        const userDoc = userToUserDoc(user);

        if (user.id) {
            const updated = await this.userModel.findByIdAndUpdate(
                user.id,
                userDoc,
                { new: true, upsert: true }
            );
            return updated._id.toString();
        } else {
            const created = await this.userModel.create(userDoc);
            return created._id.toString();
        }
    }

    async findById(id: string): Promise<User | null> {
        const doc = await this.userModel.findById(id);
        return doc ? userDocToUser(doc) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await this.userModel.findOne({ email });
        return doc ? userDocToUser(doc) : null;
    }

    async listFavorites(id: string): Promise<Module[]> {
        const user = await this.userModel.findById(id).populate('favorites');
        if (!user) {
            return [];
        }

        const favoriteModules = user.favorites as unknown as ModuleDoc[];
        return favoriteModules.map(moduleDocToModule);
    }

    async addFavorite(userId: string, moduleId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: moduleId } }
        );
    }

    async removeFavorite(userId: string, moduleId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { favorites: moduleId } }
        );
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id);
    }
}
