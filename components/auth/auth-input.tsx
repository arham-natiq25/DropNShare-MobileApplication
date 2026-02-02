/**
 * AuthInput - Fully uncontrolled: value stored in ref only, no re-renders on type/focus.
 * Fixes keyboard open/close on Android. Use ref.getValue() on submit.
 */

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { TextInput, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { GRADIENT_COLORS } from '@/constants/theme';

export type AuthInputRef = { getValue: () => string };

type AuthInputProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  defaultValue?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
};

export const AuthInput = forwardRef<AuthInputRef, AuthInputProps>(function AuthInput(
  {
    label,
    placeholder,
    value: controlledValue,
    onChangeText,
    defaultValue = '',
    secureTextEntry,
    autoCapitalize = 'none',
    keyboardType = 'default',
    leftIcon,
  },
  ref
) {
  const colors = useThemeColors();
  const valueRef = useRef(defaultValue);

  useImperativeHandle(ref, () => ({
    getValue: () => (controlledValue !== undefined ? controlledValue : valueRef.current),
  }));

  const handleChange = (text: string) => {
    valueRef.current = text;
    onChangeText?.(text);
  };

  const isControlled = controlledValue !== undefined;
  const isDark = colors.background !== '#FFFFFF';

  // Static styles – no focus state so we never re-render on focus/blur (prevents keyboard dismiss)
  const inputWrapStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: isDark ? 'rgba(15, 13, 35, 0.6)' : 'rgba(249, 250, 251, 0.9)',
    borderWidth: 1.5,
    borderColor: isDark ? 'rgba(75, 85, 99, 0.6)' : colors.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
  };

  return (
    <View style={{ marginBottom: 20 }} collapsable={false}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: colors.textSecondary,
          marginBottom: 8,
          letterSpacing: 0.5,
        }}>
        {label}
      </Text>
      <View style={inputWrapStyle} collapsable={false}>
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={20}
            color={colors.textMuted}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          defaultValue={defaultValue}
          {...(isControlled && { value: controlledValue })}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          blurOnSubmit={false}
          style={{
            flex: 1,
            paddingVertical: 14,
            fontSize: 16,
            color: colors.text,
          }}
        />
      </View>
    </View>
  );
});
