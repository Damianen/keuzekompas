import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '@/services/api';
import type { User, LoginUserDto, RegisterUserDto } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginUserDto) => Promise<void>;
  register: (data: RegisterUserDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = api.getToken();
    if (token) {
      // You could optionally fetch user data here if you store userId
      const userId = localStorage.getItem('user_id');
      if (userId) {
        api.getUser(userId)
          .then((response) => setUser(response.data))
          .catch(() => {
            api.logout();
            localStorage.removeItem('user_id');
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginUserDto) => {
    const response = await api.login(credentials);
    const userId = response.data.id;
    localStorage.setItem('user_id', userId);

    // Fetch full user data
    const userResponse = await api.getUser(userId);
    setUser(userResponse.data);
  };

  const register = async (data: RegisterUserDto) => {
    const response = await api.register(data);
    const userId = response.data.id;

    if (response.data.token) {
      localStorage.setItem('user_id', userId);
      // Fetch full user data
      const userResponse = await api.getUser(userId);
      setUser(userResponse.data);
    }
  };

  const logout = () => {
    api.logout();
    localStorage.removeItem('user_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
