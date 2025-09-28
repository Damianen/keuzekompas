export interface User {
  id?: string;
  email: string;
  name: string;
  study: string;
  passwordHash?: string;
  role: number;
  favorites: Module[];
  createdAt: Date;
}

export interface Module {
  id?: string;
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

export interface RegisterData {
  email: string;
  name: string;
  study: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  study?: string;
  email?: string;
}

export interface CreateModuleData {
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

export interface UpdateModuleData {
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  id: string;
  token: string;
}