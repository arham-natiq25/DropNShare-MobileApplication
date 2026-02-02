/**
 * AuthCard - Sleek glass-style container for login/signup forms
 * Frosted look with subtle border and accent strip
 */

import { View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { GRADIENT_COLORS } from '@/constants/theme';

type AuthCardProps = {
  children: React.ReactNode;
};

export function AuthCard({ children }: AuthCardProps) {
  const colors = useThemeColors();
  const isDark = colors.background !== '#FFFFFF';

  return (
    <View
      style={{
        backgroundColor: isDark ? 'rgba(30, 27, 46, 0.85)' : 'rgba(255, 255, 255, 0.92)',
        borderRadius: 24,
        padding: 32,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(167, 139, 250, 0.35)',
        overflow: 'hidden',
        shadowColor: isDark ? '#000' : GRADIENT_COLORS.start,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.3 : 0.12,
        shadowRadius: 24,
        elevation: 8,
      }}>
      {/* Top accent line – must not block touches */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: GRADIENT_COLORS.start,
          opacity: 0.9,
        }}
      />
      {children}
    </View>
  );
}
