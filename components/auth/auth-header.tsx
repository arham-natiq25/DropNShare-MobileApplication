/**
 * AuthHeader - Minimal header with logo and theme toggle (respects safe area)
 */

import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AuthHeader() {
  const insets = useSafeAreaInsets();
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
        paddingTop: Math.max(16, insets.top) + 24,
      }}>
      <Logo size="sm" />
      <ThemeToggle size={24} />
    </View>
  );
}
