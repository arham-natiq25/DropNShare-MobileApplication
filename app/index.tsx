/**
 * Landing Page - Menu button opens overlay sidebar on the RIGHT (closed by default)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { AppSidebar } from '@/components/main/app-sidebar';
import { FeatureCard } from '@/components/main/feature-card';
import { ProcessCard } from '@/components/main/process-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Logo } from '@/components/ui/logo';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { GRADIENT_COLORS } from '@/constants/theme';

const SIDEBAR_WIDTH = 260;
const ANIM_DURATION = 280;

export default function LandingPage() {
  const colors = useThemeColors();
  const router = useRouter();
  const isDark = colors.background !== '#FFFFFF';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarTranslate = useSharedValue(SIDEBAR_WIDTH);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (sidebarOpen) {
      sidebarTranslate.value = SIDEBAR_WIDTH;
      backdropOpacity.value = 0;
      sidebarTranslate.value = withTiming(0, { duration: ANIM_DURATION });
      backdropOpacity.value = withTiming(0.4, { duration: ANIM_DURATION });
    }
  }, [sidebarOpen]);

  const requestClose = () => {
    sidebarTranslate.value = withTiming(SIDEBAR_WIDTH, { duration: ANIM_DURATION });
    backdropOpacity.value = withTiming(
      0,
      { duration: ANIM_DURATION },
      (finished) => {
        'worklet';
        if (finished) runOnJS(setSidebarOpen)(false);
      }
    );
  };

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sidebarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarTranslate.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Main content - full width */}
      <View style={{ flex: 1 }}>
        {/* Top bar: Logo + Menu button (opens sidebar) */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingTop: 56,
            paddingBottom: 16,
          }}>
          <Logo size="sm" />
          <Pressable
            onPress={() => setSidebarOpen(true)}
            style={({ pressed }) => ({
              padding: 10,
              borderRadius: 12,
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              opacity: pressed ? 0.8 : 1,
            })}>
            <MaterialIcons name="menu" size={26} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 32,
            paddingBottom: 48,
            paddingTop: 8,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 32,
              marginBottom: 48,
            }}>
            <View style={{ flex: 1, minWidth: 280 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: isDark ? 'rgba(30, 27, 46, 0.8)' : '#F3F4F6',
                  alignSelf: 'flex-start',
                }}>
                <MaterialIcons name="bolt" size={18} color={GRADIENT_COLORS.start} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: colors.textSecondary,
                  }}>
                  Fast, clean file sharing
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 36,
                  fontWeight: '800',
                  color: colors.text,
                  lineHeight: 44,
                  marginBottom: 16,
                }}>
                Drop files.{'\n'}Share a link.{' '}
                <Text style={{ color: GRADIENT_COLORS.start }}>Done.</Text>
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  color: colors.textSecondary,
                  lineHeight: 26,
                  marginBottom: 24,
                }}>
                Upload multiple files, we zip them, and you get a download page
                instantly. Designed for speed and a great user experience.
              </Text>

              <View style={{ width: '100%', marginBottom: 32, gap: 12 }}>
                <GradientButton
                  title="Upload files"
                  icon="cloud-upload"
                  iconPosition="left"
                  onPress={() => router.push('/upload')}
                  style={{ width: '100%' }}
                />
                <GradientButton
                  title="Sign up"
                  onPress={() => router.push('/(auth)/signup')}
                  style={{ width: '100%' }}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                <FeatureCard
                  icon="folder-open"
                  title="Multi-file upload"
                  description="Drag, drop, and send."
                />
                <FeatureCard
                  icon="link"
                  title="Instant link"
                  description="Copy and share."
                />
                <FeatureCard
                  icon="auto-awesome"
                  title="Modern UI"
                  description="Clean and fast."
                />
              </View>

              <GradientButton
                title="Try now"
                variant="outline"
                onPress={() => router.push('/upload')}
                style={{ width: '100%' }}
              />
            </View>

            <View style={{ flex: 1, minWidth: 280 }}>
              <ProcessCard />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Overlay: backdrop + sidebar on RIGHT (animated) */}
      {sidebarOpen && (
        <>
          <Animated.View
            pointerEvents="box-none"
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 100,
              },
              backdropAnimatedStyle,
            ]}>
            <Pressable
              style={{ flex: 1 }}
              onPress={requestClose}
            />
          </Animated.View>
          <Animated.View
            pointerEvents="box-none"
            style={[
              {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: SIDEBAR_WIDTH,
                zIndex: 101,
              },
              sidebarAnimatedStyle,
            ]}>
            <AppSidebar activeId="home" onClose={requestClose} />
          </Animated.View>
        </>
      )}
    </View>
  );
}
