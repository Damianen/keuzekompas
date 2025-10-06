export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  study: string;
  role: number;
  createdAt: Date;
}

export interface UserWithFavorites extends User {
  favorites: ModuleSummary[];
}

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

export interface AuthResponse {
  id: string;
  token?: string;
}

// Module types
export interface Module {
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

export interface ModuleSummary {
  id: string;
  name: string;
  provider: string;
  level: string;
  duration: number;
}

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

export interface ModuleList {
  modules: Module[];
  total: number;
}
