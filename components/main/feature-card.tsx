/**
 * FeatureCard - Small card for feature highlights (Multi-file upload, Instant link, Modern UI)
 */

import { View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useThemeColors } from '@/hooks/use-theme-colors';
import { GRADIENT_COLORS } from '@/constants/theme';

type FeatureCardProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        backgroundColor: colors.card,
      }}>
      <MaterialIcons
        name={icon}
        size={24}
        color={GRADIENT_COLORS.start}
        style={{ marginBottom: 8 }}
      />
      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 4,
        }}>
        {title}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: colors.textSecondary,
        }}>
        {description}
      </Text>
    </View>
  );
}
