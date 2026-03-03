import { useState, useEffect, useContext, createContext, useCallback } from 'react';

const ADMIN_USERNAME = 'royal._.jaat707';
const ADMIN_PASSWORD = 'RAHUL2020';

export interface AuthUser {
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'hindu_dharma_auth_user';

export function createAuthContext() {
  return createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    isAuthenticated: false,
    login: async () => false,
    logout: () => {},
  });
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser: AuthUser = { username, isAdmin: true };
      setUser(adminUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      return true;
    }
    // Non-admin users: any username with any password (basic auth)
    if (username.trim().length >= 3 && password.length >= 4) {
      const normalUser: AuthUser = { username, isAdmin: false };
      setUser(normalUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return {
    user,
    isAdmin: user?.isAdmin ?? false,
    isAuthenticated: user !== null,
    login,
    logout,
  };
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
