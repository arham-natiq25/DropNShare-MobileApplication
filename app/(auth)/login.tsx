/**
 * Login Screen - Design only (no auth logic yet)
 * "Welcome back" form with Email, Password, Login button, Sign up link
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthInput } from '@/components/auth/auth-input';
import { GradientButton } from '@/components/ui/gradient-button';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function LoginScreen() {
  const colors = useThemeColors();

  const gradientColors =
    colors.background === '#FFFFFF'
      ? ['#F5F3FF', '#EDE9FE', '#FFFFFF']
      : ['#1a1730', '#0F0D23', '#0F0D23'];

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <AuthHeader />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingTop: 100,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <AuthCard>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 8,
            }}>
            Welcome back
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.textSecondary,
              marginBottom: 24,
            }}>
            Login to increase your daily upload limit.
          </Text>

          <AuthInput
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <AuthInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
          />

          <GradientButton
            title="Login"
            onPress={() => {}}
            iconPosition="right"
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
              gap: 4,
            }}>
            <Text style={{ fontSize: 15, color: colors.textSecondary }}>
              Don&apos;t have an account?{' '}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.link,
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
