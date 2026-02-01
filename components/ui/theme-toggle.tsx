/**
 * ThemeToggle - Sun/Moon icon to switch between light and dark theme
 * Sun icon = currently dark, tap to go light
 * Moon icon = currently light, tap to go dark
 */

import { Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColors } from '@/hooks/use-theme-colors';

type ThemeToggleProps = {
  size?: number;
};

export function ThemeToggle({ size = 24 }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const colors = useThemeColors();

  // Sun = dark mode active (tap to switch to light)
  // Moon = light mode active (tap to switch to dark)
  const iconName = resolvedTheme === 'dark' ? 'wb-sunny' : 'dark-mode';
  const iconColor = resolvedTheme === 'dark' ? '#FBBF24' : colors.icon;

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        padding: 8,
        borderRadius: 24,
      })}>
      <MaterialIcons name={iconName} size={size} color={iconColor} />
    </Pressable>
  );
}
