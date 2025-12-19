import { createContext, useContext, useState, ReactNode } from 'react';
import { authApi, RegisterData } from '@/services/authService';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager';
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      const adminData: Admin = {
        id: response.admin.id,
        email: response.admin.email,
        name: response.admin.name,
        role: response.admin.role as 'super_admin' | 'admin' | 'manager',
      };
      
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('token', response.token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await authApi.register(data);
      const adminData: Admin = {
        id: response.admin.id,
        email: response.admin.email,
        name: response.admin.name,
        role: response.admin.role as 'super_admin' | 'admin' | 'manager',
      };
      
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('token', response.token);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, register, logout }}>
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
