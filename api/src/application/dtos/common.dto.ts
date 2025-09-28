// Common DTOs for API responses

export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination DTOs

export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Generic operation result DTOs

export interface CreateResponse {
    id: string;
    message?: string;
}

export interface UpdateResponse {
    id: string;
    message?: string;
}

export interface DeleteResponse {
    success: boolean;
    message?: string;
}