/**
 * useThemeColors - Returns colors for current theme based on ThemeContext
 */

import { useMemo } from 'react';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export function useThemeColors() {
  const { resolvedTheme } = useTheme();
  return useMemo(
    () => (resolvedTheme === 'dark' ? Colors.dark : Colors.light),
    [resolvedTheme]
  );
}
