
/**
 * Login Screen - API-integrated. Uses uncontrolled inputs (refs) so keyboard stays open on mobile.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthInput, type AuthInputRef } from '@/components/auth/auth-input';
import { GradientButton } from '@/components/ui/gradient-button';
import { GRADIENT_COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function LoginScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const isDark = colors.background !== '#FFFFFF';

  const emailRef = useRef<AuthInputRef>(null);
  const passwordRef = useRef<AuthInputRef>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    const email = emailRef.current?.getValue()?.trim() ?? '';
    const password = passwordRef.current?.getValue() ?? '';
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (__DEV__) console.log('[Login] Submitting', { email });
    setLoading(true);
    const { error: err } = await login({ email, password });
    setLoading(false);
    if (__DEV__ && err) console.warn('[Login] Error', err);
    if (err) {
      setError(err);
      return;
    }
    router.replace('/');
  };

  const gradientColors: readonly [string, string, ...string[]] = isDark
    ? ['#0F0D23', '#1a1730', '#0d0b1a']
    : ['#FAF5FF', '#F3E8FF', '#EDE9FE', '#FFFFFF'];

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <AuthHeader />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 100 + insets.top,
          paddingBottom: 48 + insets.bottom,
        }}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}>
        {/* Decorative dot grid – must not block touches */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 120,
            right: 24,
            width: 80,
            height: 80,
            opacity: 0.15,
          }}>
          <MaterialIcons name="grid-on" size={80} color={GRADIENT_COLORS.start} />
        </View>

        <AuthCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: `${GRADIENT_COLORS.start}22`,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcons name="login" size={26} color={GRADIENT_COLORS.start} />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: '800',
                  color: colors.text,
                  letterSpacing: -0.5,
                }}>
                Welcome back
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.textSecondary,
                  marginTop: 2,
                }}>
                Sign in to continue
              </Text>
            </View>
          </View>

          {error ? (
            <View
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                padding: 12,
                borderRadius: 12,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
              <MaterialIcons name="error-outline" size={20} color="#DC2626" />
              <Text style={{ fontSize: 14, color: '#DC2626', flex: 1 }}>{error}</Text>
            </View>
          ) : null}

          <AuthInput
            ref={emailRef}
            label="Email"
            placeholder="you@example.com"
            defaultValue=""
            keyboardType="email-address"
            leftIcon="email"
          />
          <AuthInput
            ref={passwordRef}
            label="Password"
            placeholder="••••••••"
            defaultValue=""
            secureTextEntry
            leftIcon="lock"
          />

          <GradientButton
            title={loading ? 'Signing in…' : 'Sign in'}
            onPress={handleSubmit}
            iconPosition="right"
            disabled={loading}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 28,
              gap: 6,
            }}>
            <Text style={{ fontSize: 15, color: colors.textSecondary }}>
              Don&apos;t have an account?
            </Text>
            <Link href="/(auth)/signup" asChild>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: GRADIENT_COLORS.start,
                }}>
                Sign up
              </Text>
            </Link>
          </View>
        </AuthCard>
      </ScrollView>
    </LinearGradient>
  );
}
