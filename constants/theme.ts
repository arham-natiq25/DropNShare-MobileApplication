/**
 * DropNShare Theme - Colors for light and dark mode
 * Used throughout the app for consistent styling
 */

import { Platform } from 'react-native';

// Primary brand gradient colors (purple to blue)
export const GRADIENT_COLORS = {
  start: '#A78BFA', // Purple
  end: '#6366F1',   // Indigo/Blue
} as const;

export const Colors = {
  light: {
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#FFFFFF',
    backgroundSubtle: '#F9FAFB',
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    input: '#FFFFFF',
    inputBorder: '#D1D5DB',
    inputPlaceholder: '#9CA3AF',
    tint: GRADIENT_COLORS.start,
    icon: '#6B7280',
    link: '#7C3AED',
    // Gradient for buttons
    gradientStart: GRADIENT_COLORS.start,
    gradientEnd: GRADIENT_COLORS.end,
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    background: '#0F0D23',
    backgroundSubtle: '#1a1730',
    card: '#1E1B2E',
    cardBorder: '#374151',
    input: '#1E1B2E',
    inputBorder: '#4B5563',
    inputPlaceholder: '#6B7280',
    tint: GRADIENT_COLORS.start,
    icon: '#9CA3AF',
    link: '#A78BFA',
    gradientStart: GRADIENT_COLORS.start,
    gradientEnd: GRADIENT_COLORS.end,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
