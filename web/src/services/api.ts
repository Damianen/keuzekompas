import type {
    ApiResponse,
    RegisterUserDto,
    LoginUserDto,
    UpdateUserDto,
    AuthResponse,
    User,
    Module,
    ModuleList,
    CreateModuleDto,
    UpdateModuleDto,
    ModuleSummary,
} from '@/types';

const API_BASE_URL = (window as any).APP_CONFIG?.API_URL && !(window as any).APP_CONFIG?.API_URL.startsWith('${')
    ? (window as any).APP_CONFIG?.API_URL
    : import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        // Load token from localStorage if available
        this.token = localStorage.getItem('auth_token');
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    getToken(): string | null {
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (options?.headers) {
            Object.assign(headers, options.headers);
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMessage = data.error?.message || data.message || `API Error: ${response.statusText}`;
            if (data.error?.details && data.error.details.length > 0) {
                errorMessage += '\n' + data.error.details.join('\n');
            }
            throw new Error(errorMessage);
        }

        return data;
    }

    private async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    private async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    private async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    private async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    // User API methods
    async register(data: RegisterUserDto) {
        return this.post<AuthResponse>('/api/users/register', data);
    }

    async login(data: LoginUserDto) {
        const response = await this.post<AuthResponse>('/api/users/login', data);
        if (response.data.token) {
            this.setToken(response.data.token);
        }
        return response;
    }

    logout() {
        this.setToken(null);
    }

    async getUser(id: string) {
        return this.get<User>(`/api/users/${id}`);
    }

    async updateUser(id: string, data: Omit<UpdateUserDto, 'id'>) {
        return this.put<User>(`/api/users/${id}`, data);
    }

    async deleteUser(id: string) {
        return this.delete<void>(`/api/users/${id}`);
    }

    async getUserFavorites(id: string) {
        return this.get<ModuleSummary[]>(`/api/users/${id}/favorites`);
    }

    async addFavorite(userId: string, moduleId: string) {
        return this.post<void>(`/api/users/${userId}/favorites/${moduleId}`);
    }

    async removeFavorite(userId: string, moduleId: string) {
        return this.delete<void>(`/api/users/${userId}/favorites/${moduleId}`);
    }

    // Module API methods
    async listModules() {
        return this.get<ModuleList>('/api/modules');
    }

    async getModule(id: string) {
        return this.get<Module>(`/api/modules/${id}`);
    }

    async createModule(data: CreateModuleDto) {
        return this.post<Module>('/api/modules', data);
    }

    async updateModule(id: string, data: Omit<UpdateModuleDto, 'id'>) {
        return this.put<Module>(`/api/modules/${id}`, data);
    }

    async deleteModule(id: string) {
        return this.delete<void>(`/api/modules/${id}`);
    }

    // Health check
    async healthCheck() {
        return this.get<{ status: string; timestamp: string; version: string }>('/health');
    }
}

export const api = new ApiService(API_BASE_URL);
