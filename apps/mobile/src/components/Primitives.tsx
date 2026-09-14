import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow, spacing, type } from '../theme';

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type BadgeTone = 'success' | 'danger' | 'warning' | 'neutral' | 'brand';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  return (
    <View style={[styles.badge, badgeTones[tone].bg]}>
      <Text style={[styles.badgeText, badgeTones[tone].text]}>{label}</Text>
    </View>
  );
}

export function CreditChip({ amount }: { amount: number }) {
  return (
    <View style={styles.creditChip}>
      <Text style={styles.creditChipEmoji}>💳</Text>
      <Text style={styles.creditChipText}>{amount} credits</Text>
    </View>
  );
}

export function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value);
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: size, color: i <= rounded ? colors.accent : colors.border }}>
          ★
        </Text>
      ))}
    </View>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const badgeTones: Record<BadgeTone, { bg: object; text: object }> = {
  success: { bg: { backgroundColor: colors.successBg }, text: { color: colors.success } },
  danger: { bg: { backgroundColor: colors.dangerBg }, text: { color: colors.danger } },
  warning: { bg: { backgroundColor: colors.warningBg }, text: { color: colors.warning } },
  neutral: { bg: { backgroundColor: colors.surfaceAlt }, text: { color: colors.textSecondary } },
  brand: { bg: { backgroundColor: colors.accentBg }, text: { color: colors.brandDark } },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  badgeText: { ...type.caption, textTransform: 'uppercase' },
  creditChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentBg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  creditChipEmoji: { fontSize: 14, marginRight: spacing.xs },
  creditChipText: { ...type.bodyStrong, color: colors.brandDark },
  sectionTitle: { ...type.subtitle, color: colors.textPrimary, marginBottom: spacing.md },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  emptyEmoji: { fontSize: 40, marginBottom: spacing.md },
  emptyTitle: { ...type.subtitle, color: colors.textPrimary, textAlign: 'center' },
  emptySubtitle: { ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
});
