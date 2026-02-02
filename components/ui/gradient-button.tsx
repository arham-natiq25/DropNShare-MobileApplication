/**
 * GradientButton - Primary action button with purple-to-blue gradient
 * Used for Login, Sign up, Create account, Start uploading
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View, ViewStyle } from 'react-native';

import { GRADIENT_COLORS } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

type GradientButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
  disabled?: boolean;
};

export function GradientButton({
  title,
  onPress,
  icon,
  iconPosition = 'right',
  variant = 'primary',
  style,
  disabled = false,
}: GradientButtonProps) {
  const colors = useThemeColors();
  const accent = GRADIENT_COLORS.start;

  const pillStyle = {
    borderRadius: 100,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  };

  if (variant === 'outline') {
    return (
      <View
        style={[
          {
            borderRadius: 100,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: accent,
            backgroundColor: 'transparent',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
          },
          style,
        ]}>
        <Pressable
          onPress={disabled ? undefined : onPress}
          style={({ pressed }) => ({
            opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            paddingHorizontal: 24,
          })}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            {icon && iconPosition === 'left' && (
              <MaterialIcons name={icon} size={20} color={accent} />
            )}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                textAlign: 'center',
              }}>
              {title}
            </Text>
            {icon && iconPosition === 'right' ? (
              <MaterialIcons name={icon} size={20} color={accent} />
            ) : (
              <MaterialIcons name="arrow-forward" size={20} color={accent} />
            )}
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          opacity: disabled ? 0.6 : pressed ? 0.9 : 1,
          borderRadius: 100,
          overflow: 'hidden',
        },
        style,
      ]}>
      <LinearGradient
        colors={[GRADIENT_COLORS.start, GRADIENT_COLORS.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={pillStyle}>
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
