import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({ label, onPress, variant = 'primary', disabled, loading, fullWidth = true }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger' ? colors.white : colors.brand}
            style={styles.spinner}
          />
        )}
        <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel, variant === 'secondary' && styles.secondaryLabel]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  content: { flexDirection: 'row', alignItems: 'center' },
  spinner: { marginRight: spacing.sm },
  primary: { backgroundColor: colors.brand },
  secondary: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  label: { ...type.bodyStrong, color: colors.textOnBrand, flexShrink: 1, textAlign: 'center' },
  secondaryLabel: { color: colors.textPrimary },
  ghostLabel: { color: colors.brand },
});
