import { tokenStorage } from '@/utils/tokenStorage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tokenStorage.getAccessToken().then((stored) => {
      if (stored && !isTokenExpired(stored)) {
        setToken(stored);
      } else {
        if (stored) tokenStorage.clearTokens();
        setToken(null);
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    await tokenStorage.saveTokens(accessToken, refreshToken);
    setToken(accessToken);
  };

  const logout = async () => {
    await tokenStorage.clearTokens();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}