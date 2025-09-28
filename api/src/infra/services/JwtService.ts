import jwt from "jsonwebtoken";
import type { IJwtService } from "../../domain/services/IJwtService.js";

export class JwtService implements IJwtService {
    private readonly secretKey: string;

    constructor(secretKey: string) {
        if (!secretKey) {
            throw new Error("JWT secret key is required");
        }
        this.secretKey = secretKey;
    }

    async sign(payload: object, options?: { expiresIn?: string | number }): Promise<string> {
        return new Promise((resolve, reject) => {
            const signOptions: any = {};

            if (options?.expiresIn) {
                signOptions.expiresIn = options.expiresIn;
            }

            jwt.sign(payload, this.secretKey, signOptions, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token!);
                }
            });
        });
    }

    async verify<T = any>(token: string): Promise<T> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secretKey, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded as T);
                }
            });
        });
    }
}
