/**
 * ProcessCard - Large card showing Share safely + Upload, Zip, Share steps
 */

import { View, Text, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { GradientButton } from '@/components/ui/gradient-button';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { GRADIENT_COLORS } from '@/constants/theme';

const STEPS = [
  {
    icon: 'upload' as const,
    title: 'Upload',
    description: 'Select files or drag and drop.',
  },
  {
    icon: 'archive' as const,
    title: 'Zip',
    description: 'We package your files automatically.',
  },
  {
    icon: 'link' as const,
    title: 'Share',
    description: 'Send the download link to anyone.',
  },
];

export function ProcessCard() {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        backgroundColor: colors.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${GRADIENT_COLORS.start}20`,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="verified"
              size={22}
              color={GRADIENT_COLORS.start}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
              }}>
              Share safely
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
              }}>
              Simple, predictable flow.
            </Text>
          </View>
        </View>
      </View>

      {STEPS.map((step, index) => (
        <View key={step.title}>
          {index > 0 && (
            <View
              style={{
                height: 1,
                backgroundColor: colors.cardBorder,
                marginVertical: 16,
              }}
            />
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <MaterialIcons
              name={step.icon}
              size={24}
              color={GRADIENT_COLORS.start}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                {step.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                }}>
                {step.description}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
