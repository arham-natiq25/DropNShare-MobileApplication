/**
 * Root Layout - ThemeProvider, Splash screen, Stack navigation
 * Wraps the entire app with theme context and sets up routes
 */

import './global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Keep splash visible until app is ready
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1 },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="(auth)"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
