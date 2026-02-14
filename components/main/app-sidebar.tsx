/**
 * AppSidebar - Overlay sidebar on the RIGHT, with close button
 */

import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { GRADIENT_COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

type NavItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  href?: string;
  onPress?: () => void;
};

type AppSidebarProps = {
  activeId?: string;
  onClose: () => void;
};

export function AppSidebar({ activeId = 'home', onClose }: AppSidebarProps) {
  const colors = useThemeColors();
  const isDark = colors.background !== '#FFFFFF';
  const { user, isAuthenticated, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    onClose();
  };

  const baseNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: 'home', href: '/' },
    { id: 'upload', label: 'Upload', icon: 'cloud-upload', href: '/upload' },
  ];

  const authNavItems: NavItem[] = isAuthenticated
    ? [{ id: 'logout', label: 'Logout', icon: 'logout', onPress: handleLogout }]
    : [
        { id: 'login', label: 'Login', icon: 'login', href: '/(auth)/login' },
        { id: 'signup', label: 'Sign up', icon: 'person-add', href: '/(auth)/signup' },
      ];

  const navItems = [...baseNavItems, ...authNavItems];

  return (
    <View
      style={{
        width: 260,
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: isDark ? 'rgba(75, 85, 99, 0.4)' : colors.cardBorder,
        backgroundColor: isDark ? 'rgba(15, 13, 35, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        paddingVertical: 24,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      }}>
      {/* Top: Logo + Close */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isAuthenticated && user ? 8 : 32,
        }}>
        <Logo size="sm" />
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            padding: 8,
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            opacity: pressed ? 0.7 : 1,
          })}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>
      {isAuthenticated && user ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
            paddingVertical: 8,
            paddingHorizontal: 4,
          }}>
          <MaterialIcons name="person" size={20} color={GRADIENT_COLORS.start} />
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: colors.text,
              flex: 1,
            }}
            numberOfLines={1}>
            {user?.name ?? user?.email ?? 'User'}
          </Text>
        </View>
      ) : null}

      {/* Nav buttons */}
      <View style={{ flex: 1, gap: 4 }}>
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          const content = (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: isActive
                  ? `${GRADIENT_COLORS.start}18`
                  : 'transparent',
                borderWidth: isActive ? 1 : 0,
                borderColor: isActive ? `${GRADIENT_COLORS.start}40` : 'transparent',
              }}>
              <MaterialIcons
                name={item.icon}
                size={22}
                color={isActive ? GRADIENT_COLORS.start : colors.textSecondary}
              />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? colors.text : colors.textSecondary,
                }}>
                {item.label}
              </Text>
            </View>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href as any} asChild>
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.8 : 1,
                  })}>
                  {content}
                </Pressable>
              </Link>
            );
          }
          return (
            <Pressable
              key={item.id}
              onPress={item.onPress}
              disabled={item.id === 'logout' && loggingOut}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
              {item.id === 'logout' && loggingOut ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                  }}>
                  <ActivityIndicator size="small" color={GRADIENT_COLORS.start} />
                  <Text style={{ fontSize: 15, color: colors.textSecondary }}>Logging out…</Text>
                </View>
              ) : (
                content
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Bottom: Theme toggle */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: isDark ? 'rgba(75, 85, 99, 0.3)' : colors.cardBorder,
        }}>
        <Text style={{ fontSize: 13, color: colors.textSecondary }}>Theme</Text>
        <ThemeToggle size={22} />
      </View>
    </View>
  );
}
