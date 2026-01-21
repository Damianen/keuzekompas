// Input DTOs for Module operations

export interface CreateModuleDto {
    name: string;
    shortdescription: string;
    description: string;
    content: string;
    studycredit: number;
    location: string;
    contact_id: number;
    level: string;
    learningoutcomes: string;
}

export interface UpdateModuleDto {
    id: string;
    name?: string;
    shortdescription?: string;
    description?: string;
    content?: string;
    studycredit?: number;
    location?: string;
    contact_id?: number;
    level?: string;
    learningoutcomes?: string;
}

// Output DTOs for Module operations

export interface ModuleResponseDto {
    id: string;
    name: string;
    shortdescription: string;
    description: string;
    content: string;
    studycredit: number;
    location: string;
    contact_id: number;
    level: string;
    learningoutcomes: string;
}

export interface ModuleListDto {
    modules: ModuleResponseDto[];
    total: number;
}

export interface ModuleSummaryDto {
    id: string;
    name: string;
    level: string;
    studycredit: number;
}