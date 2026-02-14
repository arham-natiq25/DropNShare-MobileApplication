/**
 * AuthContext - Holds current user and auth actions (login, register, logout).
 * Restores session from stored token on mount via apiMe().
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@/lib/api';
import {
  getStoredToken,
  setStoredToken,
  apiMe,
  apiLogin,
  apiRegister,
  apiLogout,
  normalizeUser,
  type LoginPayload,
  type RegisterPayload,
} from '@/lib/api';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = await getStoredToken();
    if (!token) {
      setUser(null);
      return;
    }
    const res = await apiMe();
    const normalized = res.data?.user != null ? normalizeUser(res.data.user) : null;
    if (normalized) setUser(normalized);
    else {
      await setStoredToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getStoredToken();
      if (!token) {
        if (!cancelled) setUser(null);
        return;
      }
      const res = await apiMe();
      const normalized = res.data?.user != null ? normalizeUser(res.data.user) : null;
      if (!cancelled) {
        if (normalized) setUser(normalized);
        else {
          await setStoredToken(null);
          setUser(null);
        }
      }
    })().finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await apiLogin(payload);
    if (res.error) return { error: res.error };
    const token = (res.data as { token?: string })?.token;
    const rawUser = (res.data as { user?: unknown })?.user;
    const userObj = rawUser != null ? normalizeUser(rawUser) : null;
    if (token && userObj) {
      await setStoredToken(token);
      setUser(userObj);
      return {};
    }
    if (__DEV__) {
      console.warn('[Auth] Login invalid response: expected { token, user }', {
        hasData: !!res.data,
        hasToken: !!token,
        hasUser: !!userObj,
        keys: res.data ? Object.keys(res.data as object) : [],
      });
    }
    return { error: 'Invalid response' };
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await apiRegister(payload);
    if (res.error) return { error: res.error };
    const token = (res.data as { token?: string })?.token;
    const rawUser = (res.data as { user?: unknown })?.user;
    const userObj = rawUser != null ? normalizeUser(rawUser) : null;
    if (token && userObj) {
      await setStoredToken(token);
      setUser(userObj);
      return {};
    }
    return { error: 'Invalid response' };
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    await setStoredToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
