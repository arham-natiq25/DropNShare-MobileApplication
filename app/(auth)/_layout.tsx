/**
 * Auth Layout - Wraps login and signup screens
 * Uses Stack navigator with no header (we use custom AuthHeader)
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
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
