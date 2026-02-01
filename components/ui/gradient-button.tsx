/**
 * GradientButton - Primary action button with purple-to-blue gradient
 * Used for Login, Sign up, Create account, Start uploading
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { GRADIENT_COLORS } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

type GradientButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'outline';
};

export function GradientButton({
  title,
  onPress,
  icon,
  iconPosition = 'right',
  variant = 'primary',
}: GradientButtonProps) {
  const colors = useThemeColors();

  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: colors.inputBorder,
        })}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
          }}>
          {title}
        </Text>
        <MaterialIcons
          name={icon ?? 'arrow-forward'}
          size={20}
          color={colors.text}
        />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        borderRadius: 12,
        overflow: 'hidden',
      })}>
      <LinearGradient
        colors={[GRADIENT_COLORS.start, GRADIENT_COLORS.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 14,
          paddingHorizontal: 24,
        }}>
        {icon && iconPosition === 'left' && (
          <MaterialIcons name={icon} size={22} color="white" />
        )}
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
          {title}
        </Text>
        <MaterialIcons name="arrow-forward" size={20} color="white" />
      </LinearGradient>
    </Pressable>
  );
}
