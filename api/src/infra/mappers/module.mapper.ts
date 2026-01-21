import type { Module } from "../../domain/entities/Module.js";
import type { ModuleDoc } from "../models/module.model.js";

export function moduleDocToModule(doc: ModuleDoc): Module {
    return {
        id: doc._id.toString(),
        name: doc.name!,
        shortdescription: doc.shortdescription!,
        description: doc.description!,
        content: doc.content!,
        studycredit: doc.studycredit!,
        location: doc.location!,
        contact_id: doc.contact_id!,
        level: doc.level!,
        learningoutcomes: doc.learningoutcomes!,
    };
}

export function moduleToModuleDoc(module: Module): Partial<ModuleDoc> {
    return {
        name: module.name,
        shortdescription: module.shortdescription,
        description: module.description,
        content: module.content,
        studycredit: module.studycredit,
        location: module.location,
        contact_id: module.contact_id,
        level: module.level,
        learningoutcomes: module.learningoutcomes,
    };
}