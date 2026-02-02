/**
 * AuthHeader - Minimal header with logo and theme toggle (sleek)
 */

import { View } from 'react-native';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function AuthHeader() {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 56,
      }}>
      <Logo size="sm" />
      <ThemeToggle size={24} />
    </View>
  );
}
