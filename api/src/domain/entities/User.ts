import Module from "module";

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
