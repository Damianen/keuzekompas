// Input DTOs for Module operations

export interface CreateModuleDto {
    name: string;
    location: string;
    period: number;
    provider: string;
    duration: number;
    language: string;
    level: string;
    description: string;
    information: string;
}

export interface UpdateModuleDto {
    id: string;
    name?: string;
    location?: string;
    period?: number;
    provider?: string;
    duration?: number;
    language?: string;
    level?: string;
    description?: string;
    information?: string;
}

// Output DTOs for Module operations

export interface ModuleResponseDto {
    id: string;
    name: string;
    location: string;
    period: number;
    provider: string;
    duration: number;
    language: string;
    level: string;
    description: string;
    information: string;
    createdAt: Date;
}

export interface ModuleListDto {
    modules: ModuleResponseDto[];
    total: number;
}

export interface ModuleSummaryDto {
    id: string;
    name: string;
    provider: string;
    level: string;
    duration: number;
}