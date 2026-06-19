import { tokenStorage } from '@/utils/tokenStorage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type UserRole = 'USER' | 'BUSINESS';

interface AuthContextType {
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function extractRole(token: string): UserRole | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tokenStorage.getAccessToken().then((stored) => {
      if (stored && !isTokenExpired(stored)) {
        setToken(stored);
        setRole(extractRole(stored));
      } else {
        if (stored) tokenStorage.clearTokens();
        setToken(null);
        setRole(null);
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    await tokenStorage.saveTokens(accessToken, refreshToken);
    setToken(accessToken);
    setRole(extractRole(accessToken));
  };

  const logout = async () => {
    await tokenStorage.clearTokens();
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}