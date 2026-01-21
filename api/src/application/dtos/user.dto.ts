// Input DTOs for User operations

export interface RegisterUserDto {
    email: string;
    name: string;
    study: string;
    password: string;
    role?: number;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface UpdateUserDto {
    id: string;
    email?: string;
    name?: string;
    study?: string;
    role?: number;
}

// Output DTOs for User operations

export interface UserResponseDto {
    id: string;
    email: string;
    name: string;
    study: string;
    role: number;
    createdAt: Date;
}

export interface UserWithFavoritesDto extends UserResponseDto {
    favorites: ModuleSummaryDto[];
}

export interface ModuleSummaryDto {
    id: string;
    name: string;
    level: string;
    studycredit: number;
}

export interface AuthResponseDto {
    id: string;
    token?: string;
}