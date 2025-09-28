import axios, { type AxiosResponse } from 'axios';
import type {
  User,
  Module,
  RegisterData,
  LoginData,
  UpdateUserData,
  CreateModuleData,
  UpdateModuleData,
  ApiResponse,
  AuthResponse,
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post('/users/register', data);
    return response.data.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post('/users/login', data);
    return response.data.data;
  },
};

export const userApi = {
  async getById(id: string): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await api.get(`/users/${id}`);
    return response.data.data;
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async getFavorites(id: string): Promise<Module[]> {
    const response: AxiosResponse<ApiResponse<Module[]>> = await api.get(`/users/${id}/favorites`);
    return response.data.data;
  },

  async addFavorite(userId: string, moduleId: string): Promise<void> {
    await api.post(`/users/${userId}/favorites/${moduleId}`);
  },

  async removeFavorite(userId: string, moduleId: string): Promise<void> {
    await api.delete(`/users/${userId}/favorites/${moduleId}`);
  },
};

export const moduleApi = {
  async list(): Promise<Module[]> {
    const response: AxiosResponse<ApiResponse<{ modules: Module[], total: number }>> = await api.get('/modules');
    return response.data.data.modules;
  },

  async getById(id: string): Promise<Module> {
    const response: AxiosResponse<ApiResponse<Module>> = await api.get(`/modules/${id}`);
    return response.data.data;
  },

  async create(data: CreateModuleData): Promise<Module> {
    const response: AxiosResponse<ApiResponse<Module>> = await api.post('/modules', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateModuleData): Promise<Module> {
    const response: AxiosResponse<ApiResponse<Module>> = await api.put(`/modules/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/modules/${id}`);
  },
};

export default api;