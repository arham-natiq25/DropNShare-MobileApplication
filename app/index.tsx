/**
 * Landing Page - Main page without login
 * Hero section, feature highlights, sharing process card
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { FeatureCard } from '@/components/main/feature-card';
import { MainHeader } from '@/components/main/main-header';
import { ProcessCard } from '@/components/main/process-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { GRADIENT_COLORS } from '@/constants/theme';

export default function LandingPage() {
  const colors = useThemeColors();
  const router = useRouter();
  const isDark = colors.background !== '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <MainHeader />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 48,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 24,
            marginBottom: 48,
          }}>
          {/* Left Column - Hero */}
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
                backgroundColor: isDark ? colors.card : '#F3F4F6',
                alignSelf: 'flex-start',
              }}>
              <MaterialIcons
                name="bolt"
                size={18}
                color={GRADIENT_COLORS.start}
              />
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
              Drop files. Share a link.{' '}
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

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
              <GradientButton
                title="Start uploading"
                icon="cloud-upload"
                iconPosition="left"
                onPress={() => {}}
              />
              <GradientButton
                title="Create account"
                variant="outline"
                onPress={() => router.push('/(auth)/signup')}
              />
            </View>

            {/* Feature highlights */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
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
          </View>

          {/* Right Column - Process Card */}
          <View style={{ flex: 1, minWidth: 280 }}>
            <ProcessCard />
          </View>
        </View>

        {/* Footer */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 32,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
            }}>
            © 2026 DropNShare.
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="work" size={18} color={colors.textSecondary} />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                }}>
                Portfolio
              </Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="email" size={18} color={colors.textSecondary} />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                }}>
                Email
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
