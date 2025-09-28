export interface IJwtService {
  sign(payload: object, options?: { expiresIn?: string | number }): Promise<string>;
  verify<T = any>(token: string): Promise<T>;
}
