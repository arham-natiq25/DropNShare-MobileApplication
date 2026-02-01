/**
 * AuthInput - Styled text input for auth forms
 */

import { TextInput, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-colors';

type AuthInputProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
};

export function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType = 'default',
}: AuthInputProps) {
  const colors = useThemeColors();

  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 8,
        }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inputPlaceholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={{
          backgroundColor: colors.input,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 16,
          fontSize: 16,
          color: colors.text,
        }}
      />
    </View>
  );
}
