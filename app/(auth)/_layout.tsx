/**
 * Auth Layout - Wraps login and signup screens.
 * Redirects to home if user is already logged in.
 */

import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1 },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
