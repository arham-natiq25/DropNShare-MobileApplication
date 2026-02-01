/**
 * ThemeContext - Manages app theme (light, dark, or system)
 * Use useTheme() hook to get current theme and toggle function
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  /** Current resolved theme: 'light' or 'dark' */
  resolvedTheme: 'light' | 'dark';
  /** User preference: 'light', 'dark', or 'system' */
  themeMode: ThemeMode;
  /** Change theme mode */
  setThemeMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark (cycles: light -> dark -> light) */
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      if (prev === 'system') {
        return systemScheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'light' ? 'dark' : 'light';
    });
  }, [systemScheme]);

  const value = useMemo(
    () => ({
      resolvedTheme,
      themeMode,
      setThemeMode,
      toggleTheme,
    }),
    [resolvedTheme, themeMode, setThemeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
