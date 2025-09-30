import type { User } from "../../domain/entities/User.js";
import type { Module } from "../../domain/entities/Module.js";
import type { UserDoc } from "../models/user.model.js";
import type { ModuleDoc } from "../models/module.model.js";

export function userDocToUser(doc: UserDoc): User {
    return {
        id: doc._id.toString(),
        email: doc.email!,
        name: doc.name!,
        study: doc.study!,
        passwordHash: doc.passwordHash!,
        role: doc.role!,
        favorites: [],
        createdAt: doc.createdAt!,
    };
}

export function userToUserDoc(user: User): Partial<UserDoc> {
    const doc: any = {
        email: user.email,
        name: user.name,
        study: user.study,
        passwordHash: user.passwordHash,
        role: user.role,
        createdAt: user.createdAt,
    };

    if (user.favorites && user.favorites.length > 0) {
        doc.favorites = user.favorites.map(fav => fav.id);
    }

    return doc;
}

export function moduleDocToModule(doc: ModuleDoc): Module {
    return {
        id: doc._id.toString(),
        name: doc.name!,
        location: doc.location!,
        period: doc.period!,
        provider: doc.provider!,
        duration: doc.duration!,
        language: doc.language!,
        level: doc.level!,
        description: doc.description!,
        information: doc.information!,
        createdAt: doc.createdAt!,
    };
}
