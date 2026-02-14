/**
 * MainHeader - Header for landing page (Logo, Home, Upload, user name / Login, Sign up, Theme toggle)
 */

import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Logo } from '@/components/ui/logo';
import { GradientButton } from '@/components/ui/gradient-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAuth } from '@/contexts/AuthContext';

export function MainHeader() {
  const colors = useThemeColors();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

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
        <Pressable onPress={() => router.push('/upload')}>
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
        {isAuthenticated && user ? (
          <>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.text,
                maxWidth: 120,
              }}
              numberOfLines={1}>
              {user?.name ?? user?.email ?? 'User'}
            </Text>
            <Pressable onPress={handleLogout} disabled={loggingOut}>
              {loggingOut ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: colors.text,
                  }}>
                  Logout
                </Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
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
          </>
        )}
      </View>
    </View>
  );
}
