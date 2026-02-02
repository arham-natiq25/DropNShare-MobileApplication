/**
 * ProcessCard - Card showing Share safely + Upload, Zip, Share steps
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

import { GRADIENT_COLORS } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

const STEPS = [
  {
    icon: 'verified' as const,
    title: 'Share safely',
    description: 'We use end-to-end encryption to protect your files.',
  },
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
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        backgroundColor: colors.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}>
     

      {STEPS.map((step, index) => (
        <View key={step.title}>
          {index > 0 && (
            <View
              style={{
                height: 1,
                backgroundColor: colors.cardBorder,
                marginVertical: 12,
              }}
            />
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <MaterialIcons
              name={step.icon}
              size={22}
              color={GRADIENT_COLORS.start}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                {step.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
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
