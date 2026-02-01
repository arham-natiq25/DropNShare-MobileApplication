/**
 * AuthHeader - Header for auth screens (logo + theme toggle)
 */

import { View } from 'react-native';

import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function AuthHeader() {
  return (
    <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pt-12">
      <Logo size="sm" />
      <ThemeToggle size={24} />
    </View>
  );
}
