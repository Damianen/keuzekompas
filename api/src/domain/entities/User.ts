import type { Module } from "./Module.js";

export type User = {
    id?: string;
    email: string;
    name: string;
    study: string;
    passwordHash: string;
    role: number;
    favorites: Module[];
    createdAt: Date;
}
