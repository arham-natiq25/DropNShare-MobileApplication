/**
 * Logo - DropNShare branding (paper airplane icon + text)
 * Used in header and splash screen
 */

import { LinearGradient } from 'expo-linear-gradient';
import { View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useThemeColors } from '@/hooks/use-theme-colors';
import { GRADIENT_COLORS } from '@/constants/theme';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
};

const SIZES = {
  sm: { icon: 24, text: 18 },
  md: { icon: 32, text: 22 },
  lg: { icon: 48, text: 28 },
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const colors = useThemeColors();
  const { icon: iconSize, text: textSize } = SIZES[size];

  return (
    <View className="flex-row items-center gap-2">
      {/* Paper airplane icon in gradient circle */}
      <View
        style={{
          width: iconSize + 16,
          height: iconSize + 16,
          borderRadius: (iconSize + 16) / 2,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LinearGradient
          colors={[GRADIENT_COLORS.start, GRADIENT_COLORS.end]}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialIcons
            name="send"
            size={iconSize}
            color="white"
            style={{ transform: [{ rotate: '-45deg' }] }}
          />
        </LinearGradient>
      </View>
      {showText && (
        <Text
          style={{
            fontSize: textSize,
            fontWeight: '700',
            color: colors.text,
          }}>
          DropNShare
        </Text>
      )}
    </View>
  );
}
