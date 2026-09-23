import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants';

interface UserProfile {
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  requireAuth: (onSuccess?: () => void, targetPath?: string, customMsg?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) return JSON.parse(saved);
      const name = localStorage.getItem('userName');
      const role = localStorage.getItem('userRole');
      if (name || role) return { email: 'user@nexcinema.vn', name: name || 'Khách hàng', role: role || 'CUSTOMER' };
      return null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(token);

  const login = useCallback((newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('accessToken', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('userName', newUser.name);
    localStorage.setItem('userRole', newUser.role || 'CUSTOMER');
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCode');
    toast.success('Đã đăng xuất tài khoản!');
    navigate(ROUTES.AUTH.LOGIN);
  }, [navigate]);

  const requireAuth = useCallback(
    (onSuccess?: () => void, targetPath?: string, customMsg = 'Vui lòng đăng nhập để đặt vé.') => {
      if (isAuthenticated) {
        if (onSuccess) onSuccess();
        return true;
      }

      toast.error(customMsg);
      const redirect = targetPath || window.location.pathname + window.location.hash;
      navigate(`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(redirect)}`);
      return false;
    },
    [isAuthenticated, navigate]
  );

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
