/**
 * MainHeader - Header for landing page (Logo, Home, Upload, Login, Sign up, Theme toggle)
 */

import { View, Text, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Logo } from '@/components/ui/logo';
import { GradientButton } from '@/components/ui/gradient-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useThemeColors } from '@/hooks/use-theme-colors';

export function MainHeader() {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 50,
      }}>
      <Logo size="sm" />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        <Link href="/" asChild>
          <Pressable>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: colors.text,
                marginLeft: 10,
              }}>
              Home
            </Text>
          </Pressable>
        </Link>
        <Pressable>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: colors.text,
            }}>
            Upload
          </Text>
        </Pressable>
        <ThemeToggle size={22} />
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: colors.text,
              }}>
              Login
            </Text>
          </Pressable>
        </Link>
        <GradientButton
          title="Sign up"
          onPress={() => router.push('/(auth)/signup')}
        />
      </View>
    </View>
  );
}
