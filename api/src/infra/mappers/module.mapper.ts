import type { Module } from "../../domain/entities/Module.js";
import type { ModuleDoc } from "../models/module.model.js";

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

export function moduleToModuleDoc(module: Module): Partial<ModuleDoc> {
    return {
        name: module.name,
        location: module.location,
        period: module.period,
        provider: module.provider,
        duration: module.duration,
        language: module.language,
        level: module.level,
        description: module.description,
        information: module.information,
        createdAt: module.createdAt,
    };
}