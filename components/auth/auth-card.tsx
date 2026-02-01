/**
 * AuthCard - Container card for login/signup forms
 * Has subtle shadow, rounded corners, theme-aware background
 */

import { View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-colors';

type AuthCardProps = {
  children: React.ReactNode;
};

export function AuthCard({ children }: AuthCardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 32,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        // Shadow for elevation (light theme)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }}>
      {children}
    </View>
  );
}
