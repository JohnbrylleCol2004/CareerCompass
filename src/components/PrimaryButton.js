import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        pressed && !inactive && styles.pressedButton,
        disabled && !loading && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={inactive}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primaryDark : colors.white} />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.secondaryText, disabled && styles.disabledText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    minHeight: 48,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  pressedButton: { opacity: 0.82 },
  disabledButton: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryText: { color: colors.primaryDark },
  disabledText: { color: colors.gray },
});
